'use client'

import { useQuery } from "@tanstack/react-query";
import { getUserRooms } from "./room.api";

export const useGetUserRooms = () => {
    return useQuery({
        queryKey: ["rooms"],
        queryFn: getUserRooms,
        retry: 1,
    });
};
