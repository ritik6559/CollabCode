import z from "zod";

export type RoomType = "code" | "doc";

export interface RoomUser {
    _id: string;
    email: string;
    username: string;
}

export interface Room {
    _id: string;
    admin: RoomUser;
    name: string;
    description: string;
    /** Rooms created before the type field existed are code rooms. */
    type?: RoomType;
    language?: number;
    joinedUser?: RoomUser;
    createdAt: string;
    updatedAt: string;
    code: string;
    /** Serialized Yjs document (base64) — present once a room has been edited with CRDT sync. */
    yjsState?: string;
    /** Optimistic-concurrency counter for the diff-sync protocol. */
    contentVersion?: number;
}

export const createRoomSchema = z.object({
    name: z.string()
        .min(1, "Room name cannot be empty")
        .max(100, "Room name must be less than 100 characters")
        .trim(),
    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    type: z.enum(["code", "doc"]),
    language: z.number()
        .min(1, "Language is required")
        .optional(),
    code: z.string().optional(),
}).refine(
    (data) => data.type === "doc" || typeof data.language === "number",
    {
        message: "Language is required for code rooms",
        path: ["language"],
    }
);

export const joinRoomSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required').min(6, 'Room ID must be at least 6 characters'),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
