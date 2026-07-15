import express from "express";
import { validateToken } from "../auth/auth.middleware";
import { validateUuid } from "../../common/validate-uuid.middleware";
import { validateBody } from "../../common/validate.middleware";
import { createRoomSchema, updateRoomContentSchema } from "./room.schema";
import {
    createRoom,
    deleteRoom,
    getRoomById,
    getUserRooms,
    joinRoom,
    leaveRoom,
    updateRoomContent,
} from "./room.controller";

const roomRouter = express.Router();

const validateRoomId = validateUuid("roomId");

roomRouter.use(validateToken);

roomRouter.post("/", validateBody(createRoomSchema), createRoom);
roomRouter.get("/", getUserRooms);
roomRouter.get("/:roomId", validateRoomId, getRoomById);
roomRouter.delete("/:roomId", validateRoomId, deleteRoom);
roomRouter.patch("/:roomId/join", validateRoomId, joinRoom);
roomRouter.patch("/:roomId/leave", validateRoomId, leaveRoom);
roomRouter.patch("/:roomId/update", validateRoomId, validateBody(updateRoomContentSchema), updateRoomContent);

export default roomRouter;
