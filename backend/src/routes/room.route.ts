import express from "express";
import { validateToken } from "../middlewares/auth.middleware";
import { createRoom, deleteRoom, getRoomById, getUserRooms, joinRoom, updateRoomCode } from "../controllers/room.controller";

const roomRouter = express.Router();

roomRouter.post("/", validateToken, createRoom);
roomRouter.patch('/:roomId/join', validateToken, joinRoom);
roomRouter.patch('/:roomId/update', validateToken, updateRoomCode);
roomRouter.get('/:roomId', validateToken, getRoomById);
roomRouter.get("/", validateToken, getUserRooms);
roomRouter.delete("/:roomId", validateToken, deleteRoom);

export default roomRouter;