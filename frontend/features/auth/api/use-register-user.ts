import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateUserInput } from "../types"
import axiosClient from "@/utils/axios-client";
import { toast } from "sonner";

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
        onError: (e) => {
            console.log(e);
            toast.error("Registeration failed");
        }
    });

    return mutation;
}