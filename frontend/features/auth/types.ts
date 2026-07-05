import { z } from "zod";

export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export const createUserSchema = z.object({
    username: z.string()
        .min(1, "Username is required")
        .max(50, "Name cannot be longer than 50 characters."),
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z.string()
        .min(1, "Password is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
