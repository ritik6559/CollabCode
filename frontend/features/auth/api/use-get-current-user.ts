'use client'

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./auth.api";

/**
 * Fetches the authenticated user. Resolves to null when logged out
 * (a 401 is expected there, so no error toast is shown for it).
 */
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 5 * 60 * 1000,
        // Auth state only changes through login/logout, which update
        // the cache directly — no need to refetch on window focus.
        refetchOnWindowFocus: false,
    });
};
