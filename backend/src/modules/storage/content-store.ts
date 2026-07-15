import * as Y from "yjs";
import { ApiError } from "../../common/api-error";
import { getObjectBytes, putObjectBytes, deleteObjects } from "./s3.client";
import { applySplice, sha256Hex, TextSplice } from "./text-diff";

/**
 * Write-back cache in front of S3, one entry per room.
 *
 * Postgres owns the version counter (bumped synchronously on every accepted
 * save); S3 holds the bulk bytes and is written on a debounce, because S3
 * bills per PUT and hates chatty small writes. The durability window is the
 * debounce interval — bounded by MAX_FLUSH_DELAY_MS and a flush on shutdown.
 *
 * Single-writer assumption: this cache lives in process memory, so it is
 * correct for one backend instance. Scaling horizontally means moving it to
 * Redis or pinning rooms to instances (sticky routing).
 */

export const MAX_CONTENT_LENGTH = 256 * 1024;

const FLUSH_DELAY_MS = 2_000;
const MAX_FLUSH_DELAY_MS = 10_000;
const RETRY_DELAY_MS = 5_000;

interface Entry {
    text: string;
    yjs: Buffer | null;
    version: number;
    dirtyText: boolean;
    dirtyYjs: boolean;
    flushTimer: NodeJS.Timeout | null;
    firstDirtyAt: number | null;
}

const cache = new Map<string, Entry>();
const inFlightLoads = new Map<string, Promise<Entry>>();

const s3Keys = (roomId: string) => ({
    content: `rooms/${roomId}/content.txt`,
    yjs: `rooms/${roomId}/state.yjs`,
});

const load = async (roomId: string, dbVersion: number): Promise<Entry> => {
    const cached = cache.get(roomId);
    if (cached) {
        return cached;
    }

    const pending = inFlightLoads.get(roomId);
    if (pending) {
        return pending;
    }

    const loading = (async () => {
        const keys = s3Keys(roomId);
        const [text, yjs] = await Promise.all([
            getObjectBytes(keys.content),
            getObjectBytes(keys.yjs),
        ]);

        const entry: Entry = {
            text: text?.toString("utf8") ?? "",
            yjs,
            version: dbVersion,
            dirtyText: false,
            dirtyYjs: false,
            flushTimer: null,
            firstDirtyAt: null,
        };
        cache.set(roomId, entry);
        return entry;
    })();

    inFlightLoads.set(roomId, loading);
    try {
        return await loading;
    } finally {
        inFlightLoads.delete(roomId);
    }
};

const flush = async (roomId: string) => {
    const entry = cache.get(roomId);
    if (!entry) return;

    entry.flushTimer = null;
    entry.firstDirtyAt = null;

    const keys = s3Keys(roomId);
    const jobs: Promise<void>[] = [];

    if (entry.dirtyText) {
        entry.dirtyText = false;
        jobs.push(
            putObjectBytes(keys.content, Buffer.from(entry.text, "utf8"), "text/plain; charset=utf-8")
                .catch((e) => {
                    entry.dirtyText = true;
                    console.error(`S3 content flush failed for room ${roomId}:`, e);
                })
        );
    }

    if (entry.dirtyYjs && entry.yjs) {
        entry.dirtyYjs = false;
        const snapshot = entry.yjs;
        jobs.push(
            putObjectBytes(keys.yjs, snapshot, "application/octet-stream")
                .catch((e) => {
                    entry.dirtyYjs = true;
                    console.error(`S3 yjs flush failed for room ${roomId}:`, e);
                })
        );
    }

    await Promise.all(jobs);

    // A failed PUT leaves the dirty flag set — retry on a backoff
    if (entry.dirtyText || entry.dirtyYjs) {
        scheduleFlush(roomId, entry, RETRY_DELAY_MS);
    }
};

const scheduleFlush = (roomId: string, entry: Entry, delay = FLUSH_DELAY_MS) => {
    if (entry.firstDirtyAt === null) {
        entry.firstDirtyAt = Date.now();
    }
    if (entry.flushTimer) {
        clearTimeout(entry.flushTimer);
    }

    // Continuous typing must not defer S3 forever
    const overdue = Date.now() - entry.firstDirtyAt >= MAX_FLUSH_DELAY_MS;
    entry.flushTimer = setTimeout(() => {
        void flush(roomId);
    }, overdue ? 0 : delay);
};

export interface RoomContent {
    text: string;
    yjsBase64: string | null;
    version: number;
}

export const getContent = async (roomId: string, dbVersion: number): Promise<RoomContent> => {
    const entry = await load(roomId, dbVersion);
    return {
        text: entry.text,
        yjsBase64: entry.yjs?.toString("base64") ?? null,
        version: entry.version,
    };
};

export interface SaveInput {
    baseVersion: number;
    full?: string;
    splice?: TextSplice;
    contentHash: string;
    yjsDelta?: Buffer;
}

export interface SaveResult {
    version: number;
    preview: string;
    contentHash: string;
}

export const applySave = async (
    roomId: string,
    dbVersion: number,
    input: SaveInput
): Promise<SaveResult> => {
    const entry = await load(roomId, dbVersion);

    let nextText: string;

    if (input.full !== undefined) {
        // Full uploads are the conflict-recovery path: the text is derived
        // from the converged CRDT, so last-write-wins is safe here.
        nextText = input.full;
    } else if (input.splice) {
        // Diffs are strictly optimistic — they only apply to the exact
        // version they were computed against.
        if (input.baseVersion !== entry.version) {
            throw new ApiError(409, "Content is out of date — please retry");
        }
        nextText = applySplice(entry.text, input.splice);
    } else {
        throw new ApiError(400, "Provide either a diff or the full content");
    }

    if (nextText.length > MAX_CONTENT_LENGTH) {
        throw new ApiError(413, "Content is too large (max 256 KB)");
    }

    // The hash proves the diff reproduced the author's exact text —
    // a wrong diff is rejected, never silently persisted.
    if (sha256Hex(nextText) !== input.contentHash) {
        throw new ApiError(422, "Content checksum mismatch — please retry");
    }

    entry.text = nextText;
    entry.dirtyText = true;

    if (input.yjsDelta && input.yjsDelta.length > 0) {
        // Y.mergeUpdates is a pure function over binary updates: the server
        // maintains the canonical CRDT state without materializing a Y.Doc
        // (and therefore without caring whether this is code or rich text).
        entry.yjs = entry.yjs
            ? Buffer.from(Y.mergeUpdates([new Uint8Array(entry.yjs), new Uint8Array(input.yjsDelta)]))
            : input.yjsDelta;
        entry.dirtyYjs = true;
    }

    entry.version += 1;
    scheduleFlush(roomId, entry);

    return {
        version: entry.version,
        preview: nextText.slice(0, 500),
        contentHash: input.contentHash,
    };
};

/** Seeds content for a room created with an initial file (upload flow). */
export const seedContent = (roomId: string, text: string): void => {
    const entry: Entry = {
        text,
        yjs: null,
        version: 1,
        dirtyText: true,
        dirtyYjs: false,
        flushTimer: null,
        firstDirtyAt: null,
    };
    cache.set(roomId, entry);
    scheduleFlush(roomId, entry);
};

/** Removes cached state and deletes the room's S3 objects. */
export const dropContent = async (roomId: string): Promise<void> => {
    const entry = cache.get(roomId);
    if (entry?.flushTimer) {
        clearTimeout(entry.flushTimer);
    }
    cache.delete(roomId);

    const keys = s3Keys(roomId);
    try {
        await deleteObjects([keys.content, keys.yjs]);
    } catch (e) {
        // Orphaned objects are harmless; don't fail the API call over them
        console.error(`S3 cleanup failed for room ${roomId}:`, e);
    }
};

/** Flushes every dirty room — called on graceful shutdown. */
export const flushAllContent = async (): Promise<void> => {
    await Promise.all([...cache.keys()].map((roomId) => flush(roomId)));
};
