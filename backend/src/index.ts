import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ACTIONS } from './utils/actions';
import { initDB } from "./db";
import authRoute from "./routes/auth.route";
import roomRoute from "./routes/room.route";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const PORT = process.env.PORT || 8000;
initDB().then(() => console.log('DB connected'));


app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/room", roomRoute);

const userSocketMap: Record<string, string> = {};

const latestCodeMap: Record<string, string> = {};

const getAllConnectedClients = (roomId: string) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
        socketId,
        username: userSocketMap[socketId],
    }));
};

const handleDisconnect = (socket: any) => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
        socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
            socketId: socket.id,
            username: userSocketMap[socket.id],
        });
    });

    delete userSocketMap[socket.id];
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        console.log( clients);

        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.REQUEST_SYNC, ({ roomId, socketId }) => {
        const latestCode = latestCodeMap[roomId] || '';
        io.to(socketId).emit(ACTIONS.SYNC_CODE, { code: latestCode });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        latestCodeMap[roomId] = code;
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.CURSOR_MOVE, ({ roomId, position, username }) => {
        socket.in(roomId).emit(ACTIONS.CURSOR_MOVE, {
            socketId: socket.id,
            position,
            username
        });
    });

    socket.on('disconnecting', () => {
        handleDisconnect(socket);
    });

    socket.on('leave', () => {
        handleDisconnect(socket);
        socket.disconnect();
    });
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
