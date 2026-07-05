import { isAxiosError } from "axios";

/** Standard response envelope returned by the backend. */
export interface ApiEnvelope<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * Extracts the most specific human-readable message from an API error:
 * 1. The backend's own `message` (e.g. "Invalid email or password")
 * 2. A network-level explanation when the server is unreachable
 * 3. The provided fallback
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;

        if (typeof backendMessage === "string" && backendMessage.length > 0) {
            return backendMessage;
        }

        if (error.code === "ERR_NETWORK") {
            return "Can't reach the server. Please check your connection and try again.";
        }

        if (error.code === "ECONNABORTED") {
            return "The request timed out. Please try again.";
        }
    }

    return fallback;
};
