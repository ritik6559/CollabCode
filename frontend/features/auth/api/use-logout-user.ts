import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logoutUser } from "./auth.api";
import { getApiErrorMessage } from "@/lib/api";

export const useLogoutUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueryData(["user"], null);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("Successfully logged out");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to log out. Please try again."));
        },
    });
};
