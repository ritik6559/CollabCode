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

