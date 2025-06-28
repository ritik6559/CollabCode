import {z} from "zod";

export const createUserSchema = z.object({
    username: z.string().min(1, "User name is required"),
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
    email: z.string().email("Email is required"),
    password: z.string().min(1, "Password is required"),
});
