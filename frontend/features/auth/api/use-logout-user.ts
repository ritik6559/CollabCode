import axiosClient from "@/utils/axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useLogoutUser = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await axiosClient.delete('/auth/logout');
            console.log(res.data.data);
        },
        onSuccess: () => {
            toast.success("Successfully Logged out");
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(error);
            const errorMessage = error?.response?.data?.message || "Failed to logout";
            toast.error(errorMessage);
        }
    });

    return mutation;
}