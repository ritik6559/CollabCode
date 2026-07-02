import { Server, Socket } from "socket.io";
import { ACTIONS } from "./room.events";

interface RoomJoinPayload {
    email: string;
    room: string;
    username: string;
}

interface CodeChangePayload {
    room: string;
    code: string;
}

export const registerRoomHandlers = (io: Server, socket: Socket) => {
    socket.on(ACTIONS.ROOM_JOIN, (data: RoomJoinPayload) => {
        const { email, room, username } = data;

        io.to(room).emit(ACTIONS.USER_JOINED, {
            email,
            id: socket.id,
            username,
        });

        socket.join(room);
        io.to(socket.id).emit(ACTIONS.ROOM_JOIN, data);
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ room, code }: CodeChangePayload) => {
        socket.to(room).emit(ACTIONS.CODE_CHANGE, { code });
    });
};
