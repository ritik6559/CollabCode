import axiosClient from "@/utils/axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useJoinRoom = () => {
    
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async(roomId: string) => {
            const res = await axiosClient.patch(`/room/${roomId}/join`);
            const updatedRoom = res.data.data;
            console.log(updatedRoom);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("Room joined succeddfully")
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(error);
            const errorMessage = error?.response?.data?.message || "Failed to join room";
            toast.error(errorMessage);
        },
    });

    return mutation;
}