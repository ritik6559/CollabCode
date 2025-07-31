import z from "zod";

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
    language: number;
    joinedUser?: RoomUser;
    createdAt: string;
    updatedAt: string;
    code: string;
}

export const createRoomSchema = z.object({
    name: z.string()
        .min(1, "Room name cannot be empty")
        .max(100, "Room name must be less than 100 characters")
        .trim(),
    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    language: z.number()
        .min(1, "Language is required"),
});

export const joinRoomSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required').min(6, 'Room ID must be at least 6 characters'),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
