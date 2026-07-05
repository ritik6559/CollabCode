import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { joinRoom } from "./room.api";
import { getApiErrorMessage } from "@/lib/api";

export const useJoinRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: joinRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to join room. Please try again."));
        },
    });
};
