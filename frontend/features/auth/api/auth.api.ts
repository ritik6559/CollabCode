import { isAxiosError } from "axios";
import axiosClient from "@/utils/axios-client";
import { ApiEnvelope } from "@/lib/api";
import { CreateUserInput, LoginUserInput, User } from "../types";

export const registerUser = async (input: CreateUserInput): Promise<User> => {
    const res = await axiosClient.post<ApiEnvelope<User>>("/auth/register", input);
    return res.data.data;
};

export const loginUser = async (input: LoginUserInput): Promise<User> => {
    const res = await axiosClient.post<ApiEnvelope<User>>("/auth/login", input);
    return res.data.data;
};

export const logoutUser = async (): Promise<void> => {
    await axiosClient.delete<ApiEnvelope<null>>("/auth/logout");
};

/**
 * Returns the current user, or null when not authenticated.
 * A 401 is the normal "not logged in" case — not an error.
 */
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const res = await axiosClient.get<ApiEnvelope<User>>("/auth/me");
        return res.data.data;
    } catch (e) {
        if (isAxiosError(e) && e.response?.status === 401) {
            return null;
        }
        throw e;
    }
};
