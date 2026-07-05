import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRoom } from "./room.api";
import { getApiErrorMessage } from "@/lib/api";

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRoom,
        onSuccess: (deleted) => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success(`Room "${deleted.name}" deleted`);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to delete room. Please try again."));
        },
    });
};
