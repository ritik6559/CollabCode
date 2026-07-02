import express from "express";
import { validateToken } from "../auth/auth.middleware";
import { validateObjectId } from "../../common/validate-object-id.middleware";
import { validateBody } from "../../common/validate.middleware";
import { createRoomSchema, updateRoomCodeSchema } from "./room.schema";
import {
    createRoom,
    deleteRoom,
    getRoomById,
    getUserRooms,
    joinRoom,
    leaveRoom,
    updateRoomCode,
} from "./room.controller";

const roomRouter = express.Router();

const validateRoomId = validateObjectId("roomId");

roomRouter.use(validateToken);

roomRouter.post("/", validateBody(createRoomSchema), createRoom);
roomRouter.get("/", getUserRooms);
roomRouter.get("/:roomId", validateRoomId, getRoomById);
roomRouter.delete("/:roomId", validateRoomId, deleteRoom);
roomRouter.patch("/:roomId/join", validateRoomId, joinRoom);
roomRouter.patch("/:roomId/leave", validateRoomId, leaveRoom);
roomRouter.patch("/:roomId/update", validateRoomId, validateBody(updateRoomCodeSchema), updateRoomCode);

export default roomRouter;
