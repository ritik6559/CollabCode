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
    members: RoomUser[];
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

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
