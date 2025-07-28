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

const emailToSocketMap = new Map();
const socketidToEmailMap = new Map();

const latestCodeMap: Record<string, string> = {};

io.on('connection', (socket) => {
    console.log("Socker connected: ", socket.id);

    socket.on(ACTIONS.ROOM_JOIN, (data) => {
        const { email, room } = data;
        emailToSocketMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);

        io.to(room).emit(ACTIONS.USER_JOINED, {
            email, id: socket.id
        });
        socket.join(room);
        io.to(socket.id).emit(ACTIONS.ROOM_JOIN, data);
    });

    socket.on(ACTIONS.USER_CALL, ({ to, offer }) => {
        io.to(to).emit(ACTIONS.INCOMING_CALL, { from: socket.id, offer });
    });

    socket.on(ACTIONS.CALL_ACCEPTED, ({ to, ans }) => {
        io.to(to).emit(ACTIONS.CALL_ACCEPTED, { from: socket.id, ans });
    });

    socket.on(ACTIONS.PEER_NEGO_NEEDED , ({ to, offer }) => {
        console.log("nego need: ", offer);
        io.to(to).emit(ACTIONS.PEER_NEGO_NEEDED, { from: socket.id, offer });
    });

    socket.on(ACTIONS.PEER_NEGO_DONE, ({ to, ans }) => {
        console.log("nego done", ans);
        io.to(to).emit(ACTIONS.PEER_NEGO_DONE, { from: socket.id, ans });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ room, code }) => {
        latestCodeMap[room] = code;
        socket.to(room).emit(ACTIONS.CODE_CHANGE, { code });
    });

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
