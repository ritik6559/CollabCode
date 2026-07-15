import { Server, Socket } from "socket.io";
import { ACTIONS } from "./room.events";
import { prisma } from "../../db/prisma";
import { MAX_CONTENT_LENGTH } from "../storage/content-store";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

            if (typeof roomId !== "string" || !UUID_RE.test(roomId)) {
                emitRoomError(socket, "Invalid room id");
                return;
            }

            const room = await prisma.room.findUnique({
                where: { id: roomId },
                select: { adminId: true, joinedUserId: true },
            });

            if (!room) {
                emitRoomError(socket, "Room not found");
                return;
            }

            // Only the admin or the joined member may enter the socket room
            const userId = socket.data.userId as string;
            const isMember =
                room.adminId === userId ||
                room.joinedUserId === userId;

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

    // Yjs CRDT sync — binary document updates and awareness (cursors,
    // names, colors) relayed only within rooms this socket has joined.
    const relayBinary = (event: string) =>
        (payload: { room: string; update: Buffer }) => {
            const roomId = payload?.room;
            const update = payload?.update;

            if (typeof roomId !== "string" || !socket.rooms.has(roomId)) {
                return;
            }

            if (!Buffer.isBuffer(update) || update.byteLength > MAX_CONTENT_LENGTH * 2) {
                return;
            }

            socket.to(roomId).emit(event, { update });
        };

    socket.on(ACTIONS.YJS_UPDATE, relayBinary(ACTIONS.YJS_UPDATE));
    socket.on(ACTIONS.YJS_AWARENESS, relayBinary(ACTIONS.YJS_AWARENESS));

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
