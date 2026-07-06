import { z } from "zod";

export const MAX_CONTENT_LENGTH = 256 * 1024; // keep in sync with the frontend upload cap

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

export const updateRoomCodeSchema = z.object({
    code: z.string({ required_error: "Code field is required" })
        .max(MAX_CONTENT_LENGTH, "Content is too large (max 256 KB)"),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomCodeInput = z.infer<typeof updateRoomCodeSchema>;
