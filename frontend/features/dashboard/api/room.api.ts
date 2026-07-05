import axiosClient from "@/utils/axios-client";
import { ApiEnvelope } from "@/lib/api";
import { CreateRoomInput, Room } from "../types";

export const createRoom = async (input: CreateRoomInput): Promise<Room> => {
    const res = await axiosClient.post<ApiEnvelope<Room>>("/room", input);
    return res.data.data;
};

export const getUserRooms = async (): Promise<Room[]> => {
    const res = await axiosClient.get<ApiEnvelope<Room[]>>("/room");
    return res.data.data;
};

export const getRoomById = async (roomId: string): Promise<Room> => {
    const res = await axiosClient.get<ApiEnvelope<Room>>(`/room/${roomId}`);
    return res.data.data;
};

export const joinRoom = async (roomId: string): Promise<Room> => {
    const res = await axiosClient.patch<ApiEnvelope<Room>>(`/room/${roomId}/join`);
    return res.data.data;
};

export const leaveRoom = async (roomId: string): Promise<Room> => {
    const res = await axiosClient.patch<ApiEnvelope<Room>>(`/room/${roomId}/leave`);
    return res.data.data;
};

export const deleteRoom = async (roomId: string): Promise<{ roomId: string; name: string }> => {
    const res = await axiosClient.delete<ApiEnvelope<{ roomId: string; name: string }>>(`/room/${roomId}`);
    return res.data.data;
};

export const updateRoomCode = async ({ roomId, code }: { roomId: string; code: string }): Promise<Room> => {
    const res = await axiosClient.patch<ApiEnvelope<Room>>(`/room/${roomId}/update`, { code });
    return res.data.data;
};
