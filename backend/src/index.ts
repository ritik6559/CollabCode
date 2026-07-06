import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { initDB } from "./db";
import { CLIENT_URL } from "./utils/config";
import { errorHandler } from "./common/error.middleware";
import authRoute from "./modules/auth/auth.routes";
import { authenticateSocket } from "./modules/auth/auth.middleware";
import roomRoute from "./modules/room/room.routes";
import { registerRoomHandlers } from "./modules/room/room.gateway";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [CLIENT_URL],
        credentials: true,
    },
    // Cap socket payloads — content sync is limited to 256 KB anyway
    maxHttpBufferSize: 1e6,
});
const PORT = process.env.PORT || 8000;

initDB()
    .then(() => console.log('DB connected'))
    .catch((e) => {
        console.error('DB connection failed:', e);
        process.exit(1);
    });

// Bumped from the 100kb default so content (max 256 KB) plus the serialized
// Yjs state fit in one request
app.use(express.json({ limit: "2mb" }));
app.use(cors({
    origin: [CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/room", roomRoute);

app.use(errorHandler);

io.use(authenticateSocket);

io.on('connection', (socket) => {
    registerRoomHandlers(io, socket);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
