import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginUser } from "./auth.api";
import { getApiErrorMessage } from "@/lib/api";

export const useLoginUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (user) => {
            queryClient.setQueryData(["user"], user);
            toast.success(`Welcome back, ${user.username}!`);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to sign in. Please try again."));
        },
    });
};
