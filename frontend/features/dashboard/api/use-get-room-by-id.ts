'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/utils/axios-client";
import { toast } from "sonner";

export const useGetRoomById = (roomId: string) => {
    return useQuery({
        queryKey: ["room", roomId],
        queryFn: async () => {
            try {
                const res = await axiosClient.get(`/room/${roomId}`);
                return res.data.data;
            } catch (error: any) {
                console.log(error);
                toast.error("Failed to fetch room.")
            }
        },
    });
};
