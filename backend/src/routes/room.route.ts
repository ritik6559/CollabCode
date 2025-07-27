import express from "express";
import {validateToken} from "../middlewares/auth.middleware";
import {createRoom, deleteRoom, getRoomById, getUserRooms, joinRoom} from "../controllers/room.controller";

const roomRouter = express.Router();

roomRouter.post("/create-room", validateToken, createRoom);
roomRouter.patch('/join-room/:roomId', validateToken, joinRoom);
roomRouter.get('/:roomId', validateToken, getRoomById);
roomRouter.get("/user/rooms", validateToken, getUserRooms);
roomRouter.delete("/:roomId", validateToken, deleteRoom);

export default roomRouter;
