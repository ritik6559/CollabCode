'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { syncRoomContent } from "../api/room.api";
import { computeSplice, sha256Hex } from "@/lib/diff";
import { uint8ToBase64 } from "@/lib/collab";
import { getApiErrorMessage } from "@/lib/api";

interface SyncState {
    /** The last text the server acknowledged — the diff base. */
    text: string;
    /** The server's content version for that text (optimistic lock). */
    version: number;
    /** Yjs state vector at the last ack — deltas are encoded against it. */
    vector: Uint8Array;
}

/**
 * Debounced, diff-based persistence. Each save ships:
 *  - a minimal text splice against the last acked text (+ SHA-256 proof)
 *  - the incremental Yjs update since the last acked state vector
 * On a 409/422 (a peer saved first, or the diff didn't reproduce the hash)
 * it recovers by resending the full text once — safe, because the text is
 * derived from the converged CRDT.
 */
export const useContentSync = (roomId: string, debounceDelay = 1000) => {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const stateRef = useRef<SyncState | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const busyRef = useRef(false);
    const queuedRef = useRef<{ doc: Y.Doc; text: string } | null>(null);

    /** Call once after hydration, so the first diff has a correct base. */
    const initializeSync = useCallback(
        ({ text, version, doc }: { text: string; version: number; doc: Y.Doc }) => {
            stateRef.current = {
                text,
                version,
                vector: Y.encodeStateVector(doc),
            };
        },
        []
    );

    const performSave = useCallback(async (doc: Y.Doc, text: string) => {
        const state = stateRef.current;
        if (!state) {
            return;
        }
        if (busyRef.current) {
            queuedRef.current = { doc, text };
            return;
        }

        const splice = computeSplice(state.text, text);
        const delta = Y.encodeStateAsUpdate(doc, state.vector);
        const hasYjsChanges = delta.length > 2; // an empty delta is just header bytes

        if (!splice && !hasYjsChanges) {
            return;
        }

        busyRef.current = true;
        setIsSaving(true);

        try {
            const contentHash = await sha256Hex(text);
            const base = {
                roomId,
                baseVersion: state.version,
                contentHash,
                yjsDelta: hasYjsChanges ? uint8ToBase64(delta) : undefined,
            };

            let version: number;
            try {
                ({ version } = await syncRoomContent({
                    ...base,
                    splice: splice ?? { start: 0, deleteCount: 0, insert: "" },
                }));
            } catch (e) {
                const status = isAxiosError(e) ? e.response?.status : undefined;
                if (status !== 409 && status !== 422) {
                    throw e;
                }
                // Conflict recovery: full upload, last-write-wins on the
                // derived text (the CRDT state merges either way)
                ({ version } = await syncRoomContent({ ...base, full: text }));
            }

            stateRef.current = { text, version, vector: Y.encodeStateVector(doc) };
            setLastSaved(new Date());
        } catch (e) {
            console.error("Content sync failed:", e);
            toast.error(getApiErrorMessage(e, "Failed to save — will retry on your next edit."));
        } finally {
            busyRef.current = false;
            setIsSaving(false);

            const queued = queuedRef.current;
            queuedRef.current = null;
            if (queued) {
                void performSave(queued.doc, queued.text);
            }
        }
    }, [roomId]);

    const scheduleSave = useCallback((doc: Y.Doc, text: string) => {
        if (!stateRef.current) {
            return;
        }
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => void performSave(doc, text), debounceDelay);
    }, [performSave, debounceDelay]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return { initializeSync, scheduleSave, isSaving, lastSaved };
};
