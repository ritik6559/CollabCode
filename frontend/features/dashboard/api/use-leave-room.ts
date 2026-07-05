import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { leaveRoom } from "./room.api";
import { getApiErrorMessage } from "@/lib/api";

export const useLeaveRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: leaveRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            toast.success("You left the room");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to leave room. Please try again."));
        },
    });
};
