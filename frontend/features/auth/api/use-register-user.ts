import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerUser } from "./auth.api";
import { getApiErrorMessage } from "@/lib/api";

export const useRegisterUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (user) => {
            queryClient.setQueryData(["user"], user);
            toast.success(`Welcome to CollabCode, ${user.username}!`);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to create your account. Please try again."));
        },
    });
};
