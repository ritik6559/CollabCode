'use client';

import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "./room.api";

export const useGetRoomById = (roomId: string) => {
    return useQuery({
        queryKey: ["room", roomId],
        queryFn: () => getRoomById(roomId),
        enabled: !!roomId,
        retry: 1,
    });
};
