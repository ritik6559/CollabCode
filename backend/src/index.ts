import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { initDB } from "./db";
import { errorHandler } from "./common/error.middleware";
import authRoute from "./modules/auth/auth.routes";
import roomRoute from "./modules/room/room.routes";
import { registerRoomHandlers } from "./modules/room/room.gateway";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ['GET', 'POST'],
    },
});
const PORT = process.env.PORT || 8000;

initDB()
    .then(() => console.log('DB connected'))
    .catch((e) => {
        console.error('DB connection failed:', e);
        process.exit(1);
    });

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/room", roomRoute);

app.use(errorHandler);

io.on('connection', (socket) => {
    console.log("Socket connected: ", socket.id);

    registerRoomHandlers(io, socket);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
