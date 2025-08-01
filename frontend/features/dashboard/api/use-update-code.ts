import axiosClient from "@/utils/axios-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

type UpdateCodeInput = {
    roomId: string;
    code: string;
};

export const useUpdateCode = () => {
    
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ( { roomId, code }: UpdateCodeInput ) => {
            const res = await axiosClient.patch(`/room/${roomId}/update`, {code});
            const updatedRoom = res.data.data;
            console.log(updatedRoom);
            return updatedRoom;
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(error);
            const errorMessage = error?.response?.data?.message || "Failed to update code.";
            toast.error(errorMessage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ "rooms" ] });
        }
    });

    return mutation;
}