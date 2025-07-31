import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateUserInput } from "../types"
import axiosClient from "@/utils/axios-client";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useRegisterUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (user: CreateUserInput) => {
            const res = await axiosClient.post("/auth/register", user);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success("Registration successful")
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(error);
            const errorMessage = error?.response?.data?.message || "Failed to register user";
            toast.error(errorMessage);
        },
    });

    return mutation;
}