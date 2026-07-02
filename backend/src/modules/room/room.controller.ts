import { asyncHandler } from "../../common/async-handler";
import * as roomService from "./room.service";

export const createRoom = asyncHandler(async (req, res) => {
    const room = await roomService.createRoom(req.userId!, req.body);

    res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: room,
    });
});

export const joinRoom = asyncHandler(async (req, res) => {
    const { room, message } = await roomService.joinRoom(req.params.roomId, req.userId!);

    res.status(200).json({
        success: true,
        message,
        data: room,
    });
});

export const leaveRoom = asyncHandler(async (req, res) => {
    const { room, message } = await roomService.leaveRoom(req.params.roomId, req.userId!);

    res.status(200).json({
        success: true,
        message,
        data: room,
    });
});

export const updateRoomCode = asyncHandler(async (req, res) => {
    const room = await roomService.updateRoomCode(req.params.roomId, req.body.code);

    res.status(200).json({
        success: true,
        message: "Room code updated successfully",
        data: room,
    });
});

export const getUserRooms = asyncHandler(async (req, res) => {
    const rooms = await roomService.getUserRooms(req.userId!);

    res.status(200).json({
        success: true,
        message: "Rooms fetched successfully",
        data: rooms,
    });
});

export const getRoomById = asyncHandler(async (req, res) => {
    const room = await roomService.getRoomById(req.params.roomId);

    res.status(200).json({
        success: true,
        message: "Room fetched successfully",
        data: room,
    });
});

export const deleteRoom = asyncHandler(async (req, res) => {
    const deleted = await roomService.deleteRoom(req.params.roomId, req.userId!);

    res.status(200).json({
        success: true,
        message: "Room deleted successfully",
        data: deleted,
    });
});
