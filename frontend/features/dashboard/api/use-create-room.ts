import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRoom } from "./room.api";
import { getApiErrorMessage } from "@/lib/api";

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRoom,
        onSuccess: (room) => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success(`Room "${room.name}" created`);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to create room. Please try again."));
        },
    });
};
