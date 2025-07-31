import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";
import { CreateRoomInput } from "../types";
import axiosClient from "@/utils/axios-client";
import { AxiosError } from "axios";

export const useCreateRoom = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: CreateRoomInput) => {
            const res = await axiosClient.post("/room", data);
            const room = res.data.data;
            console.log(room);
            return room;
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(error);
            const errorMessage = error?.response?.data?.message || "Failed to create room";
            toast.error(errorMessage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("Room created successfully.")
        }
    });

    return mutation;
}