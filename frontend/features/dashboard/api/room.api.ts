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

export interface SyncContentPayload {
    roomId: string;
    /** The content version this save was computed against (optimistic lock). */
    baseVersion: number;
    /** Recovery / first-save path: the whole text. */
    full?: string;
    /** Normal path: a minimal single-region diff. */
    splice?: { start: number; deleteCount: number; insert: string };
    /** SHA-256 of the resulting text — the server refuses mismatches. */
    contentHash: string;
    /** Incremental Yjs update (base64) since the last acked save. */
    yjsDelta?: string;
}

export const syncRoomContent = async ({
    roomId,
    ...body
}: SyncContentPayload): Promise<{ version: number }> => {
    const res = await axiosClient.patch<ApiEnvelope<{ version: number }>>(`/room/${roomId}/update`, body);
    return res.data.data;
};
