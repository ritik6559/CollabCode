import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import { ACTIONS } from "./room.events";
import { Room } from "./room.model";
import { MAX_CONTENT_LENGTH } from "./room.schema";

interface RoomJoinPayload {
    email: string;
    room: string;
    username: string;
}

interface ContentChangePayload {
    room: string;
    code?: string;
    content?: string;
}

const emitRoomError = (socket: Socket, message: string) => {
    socket.emit(ACTIONS.ROOM_ERROR, { message });
};

export const registerRoomHandlers = (io: Server, socket: Socket) => {
    socket.on(ACTIONS.ROOM_JOIN, async (payload: RoomJoinPayload) => {
        try {
            const roomId = payload?.room;
            const username = typeof payload?.username === "string" ? payload.username : "Anonymous";

            if (typeof roomId !== "string" || !mongoose.Types.ObjectId.isValid(roomId)) {
                emitRoomError(socket, "Invalid room id");
                return;
            }

            const room = await Room.findById(roomId);

            if (!room) {
                emitRoomError(socket, "Room not found");
                return;
            }

            // Only the admin or the joined member may enter the socket room
            const userId = socket.data.userId as string;
            const isMember =
                room.admin.toString() === userId ||
                room.joinedUser?.toString() === userId;

            if (!isMember) {
                emitRoomError(socket, "You are not a member of this room");
                return;
            }

            socket.data.roomId = roomId;
            socket.data.username = username;

            socket.to(roomId).emit(ACTIONS.USER_JOINED, {
                id: socket.id,
                email: payload.email,
                username,
            });

            socket.join(roomId);
            socket.emit(ACTIONS.ROOM_JOIN, payload);
        } catch (e) {
            console.error("ROOM_JOIN failed:", e);
            emitRoomError(socket, "Failed to join room");
        }
    });

    // Content relays are only honoured for rooms this socket has joined,
    // and payloads are size-capped. The server holds no document state.
    const relayContent = (event: string, field: "code" | "content") =>
        (payload: ContentChangePayload) => {
            const roomId = payload?.room;
            const value = payload?.[field];

            if (typeof roomId !== "string" || !socket.rooms.has(roomId)) {
                return;
            }

            if (typeof value !== "string" || value.length > MAX_CONTENT_LENGTH) {
                emitRoomError(socket, "Content is too large to sync (max 256 KB)");
                return;
            }

            socket.to(roomId).emit(event, { [field]: value });
        };

    socket.on(ACTIONS.CODE_CHANGE, relayContent(ACTIONS.CODE_CHANGE, "code"));
    socket.on(ACTIONS.DOC_CHANGE, relayContent(ACTIONS.DOC_CHANGE, "content"));

    socket.on("disconnect", () => {
        const roomId = socket.data.roomId as string | undefined;

        if (roomId) {
            socket.to(roomId).emit(ACTIONS.USER_LEFT, {
                id: socket.id,
                username: socket.data.username,
            });
        }
    });
};
