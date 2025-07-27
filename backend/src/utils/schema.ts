import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string()
        .min(1, "User name is required")
        .max(50, "Name cannot be longer than 50 characters."),
    email: z.string()
        .email()
        .min(1, "Email is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
    email: z.string()
        .email("Email is required"),
    password: z.string()
        .min(1, "Password is required"),
});

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

export const updateRoomSchema = z.object({
    name: z.string()
        .min(1, "Room name cannot be empty")
        .max(100, "Room name must be less than 100 characters")
        .trim()
        .optional(),

    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),

    language: z.string()
        .min(1, "Language cannot be empty")
        .optional(),

    code: z.string()
        .optional(),

    joinedUser: z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid ObjectId format"
    )
}).refine(
    (data) => {
        return Object.keys(data).length > 0;
    },
    {
        message: "At least one field must be provided for update"
    }
);
