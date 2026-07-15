import { z } from "zod";
import { MAX_CONTENT_LENGTH } from "../storage/content-store";

export const createRoomSchema = z.object({
    name: z.string()
        .min(1, "Room name cannot be empty")
        .max(100, "Room name must be less than 100 characters")
        .trim(),
    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    type: z.enum(["code", "doc"])
        .default("code"),
    language: z.number()
        .min(1, "Language is required")
        .optional(),
    code: z.string()
        .max(MAX_CONTENT_LENGTH, "Content is too large (max 256 KB)")
        .optional(),
}).refine(
    (data) => data.type === "doc" || typeof data.language === "number",
    {
        message: "Language is required for code rooms",
        path: ["language"],
    }
);

/**
 * Diff-based content sync. `splice` is a minimal single-region diff applied
 * optimistically against `baseVersion`; `full` is the recovery path (and the
 * first save). `contentHash` is the SHA-256 of the resulting text — the
 * server refuses any save whose applied result doesn't hash-match.
 * `yjsDelta` is the incremental CRDT update since the client's last save.
 */
export const updateRoomContentSchema = z.object({
    baseVersion: z.number().int().min(0),
    full: z.string()
        .max(MAX_CONTENT_LENGTH, "Content is too large (max 256 KB)")
        .optional(),
    splice: z.object({
        start: z.number().int().min(0),
        deleteCount: z.number().int().min(0),
        insert: z.string().max(MAX_CONTENT_LENGTH),
    }).optional(),
    contentHash: z.string().regex(/^[a-f0-9]{64}$/, "Invalid content hash"),
    yjsDelta: z.string()
        .max(1_000_000, "Document state update is too large")
        .optional(),
}).refine(
    (data) => (data.full === undefined) !== (data.splice === undefined),
    { message: "Provide exactly one of full or splice" }
);

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomContentInput = z.infer<typeof updateRoomContentSchema>;
