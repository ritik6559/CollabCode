import axiosClient from "@/utils/axios-client";
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner";

export const useGetUserRooms = () => {
    const query = useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
            try{
                const res = await axiosClient.get("/room");
                const rooms = res.data.data;
                console.log(rooms);
                return rooms;
            } catch (e){
                console.log(e);
                toast.error("Failed to fecth rooms.")
            }
        }
    });

    return query;
}