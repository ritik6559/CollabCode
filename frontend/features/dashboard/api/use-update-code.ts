import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateRoomCode } from "./room.api";
import { getApiErrorMessage } from "@/lib/api";

export const useUpdateCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRoomCode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to save code. Please try again."));
        },
    });
};
