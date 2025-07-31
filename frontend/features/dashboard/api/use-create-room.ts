import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateRoomInput } from "../types";
import axiosClient from "@/utils/axios-client";

export const useCreateRoom = () => {
    
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: CreateRoomInput) => {
            const res = await axiosClient.post("/room", data);
            const room = res.data.data;
            console.log(room);
            return room;
        },
        onError: (e: Error) => {
            console.log(e);
            toast.error('Failed to create room');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        }
    });

    return mutation;
}