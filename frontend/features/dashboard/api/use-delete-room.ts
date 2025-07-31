import axiosClient from "@/utils/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteRoom = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (roomId: string) => {
            const res = await axiosClient.delete(`/${roomId}`);
            const data = res.data.data;
            console.log(data);
            return data;
        },
        onSuccess: () => {
            toast.success("Room deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(error);
            const errorMessage = error?.response?.data?.message || "Failed to delete room";
            toast.error(errorMessage);
        },
    });

    return mutation;
}