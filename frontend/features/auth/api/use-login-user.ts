import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoginUserInput } from "../types"
import axiosClient from "@/utils/axios-client";
import { toast } from "sonner";

export const useLoginUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (user: LoginUserInput) => {
            const res = await axiosClient.post("/auth/login", user);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success("Login successful")
        },
        onError: (e) => {
            console.log(e);
            toast.error("Login failed");
        }
    });

    return mutation;
}