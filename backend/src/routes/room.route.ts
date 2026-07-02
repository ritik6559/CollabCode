import express from "express";
import { validateToken } from "../middlewares/auth.middleware";
import { validateObjectId } from "../middlewares/validate-object-id.middleware";
import { createRoom, deleteRoom, getRoomById, getUserRooms, joinRoom, leaveRoom, updateRoomCode } from "../controllers/room.controller";

const roomRouter = express.Router();

const validateRoomId = validateObjectId("roomId");

roomRouter.post("/", validateToken, createRoom);
roomRouter.patch("/:roomId/join", validateToken, validateRoomId, joinRoom);
roomRouter.patch("/:roomId/update", validateToken, validateRoomId, updateRoomCode);
roomRouter.patch("/:roomId/leave", validateToken, validateRoomId, leaveRoom);
roomRouter.get("/:roomId", validateToken, validateRoomId, getRoomById);
roomRouter.get("/", validateToken, getUserRooms);
roomRouter.delete("/:roomId", validateToken, validateRoomId, deleteRoom);

export default roomRouter;
