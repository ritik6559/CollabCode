import { z } from "zod";

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

export const updateRoomCodeSchema = z.object({
    code: z.string({ required_error: "Code field is required" }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomCodeInput = z.infer<typeof updateRoomCodeSchema>;
