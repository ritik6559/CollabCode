import { Request, Response } from "express";
import { createRoomSchema } from "../utils/schema";
import { Room } from "../models/room.model";

export const createRoom = async (req: Request, res: Response) => {
    try {
        const verify = createRoomSchema.safeParse(req.body);

        if (!verify.success) {
            res.status(400).json({
                success: false,
                message: `All fields are required`,
                data: null
            });
            return;
        }

        const { name, description, language } = verify.data;

        const room = await Room.create({
            name,
            description: description ?? "",
            language,
            admin: req.userId,
        });

        res.status(201).json({
            success: true,
            message: "Room created successfully",
            data: room
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server error",
            data: null
        });
    }
}

export const joinRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        const room = await Room.findById(roomId);

        if (!room) {
            res.status(404).json({
                success: false,
                message: "Room not found",
                data: null
            });
            return;
        }

        const isAdmin = room.admin.toString() === userId;
        const isAlreadyJoined = room.joinedUser?.toString() === userId;

        if (isAdmin) {
            res.status(200).json({
                success: true,
                message: "You are the admin",
                data: room
            });
            return;
        }

        if (isAlreadyJoined) {
            res.status(200).json({
                success: true,
                message: "You are already in this room",
                data: room
            });
            return;
        }

        if (room.joinedUser) {
            res.status(400).json({
                success: false,
                message: "Room is full. Only 2 users allowed (admin + 1 member)",
                data: null
            });
            return;
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { joinedUser: userId },
            { new: true }
        ).populate("admin", "_id username email")
         .populate("joinedUser", "_id username email");

        res.status(200).json({
            success: true,
            message: "Successfully joined the room",
            data: updatedRoom
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server error",
            data: null
        });
    }
};

export const leaveRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        const room = await Room.findById(roomId);

        if (!room) {
            res.status(404).json({
                success: false,
                message: "Room not found",
                data: null
            });
            return;
        }

        const isAdmin = userId === room.admin._id.toString();
        const isJoinedUser = userId === room.joinedUser?._id.toString();

        if (!isAdmin && !isJoinedUser) {
            res.status(403).json({
                success: false,
                message: "Not authorized to leave this room",
                data: null
            });
            return;
        }

        let message = "";

        if (isAdmin) {
            if (!room.joinedUser) {
                res.status(400).json({
                    success: false,
                    message: "Can't leave an empty room.",
                    data: null
                });
                return;
            }

            room.admin = room.joinedUser;
            room.joinedUser = null;
            message = "Left room and transferred admin rights to the other user";
        } else {
            room.joinedUser = null;
            message = "Left room successfully";
        }

        await room.save();

        res.status(200).json({
            success: true,
            message,
            data: room
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server error",
            data: null
        });
    }
};

export const updateRoomCode = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const { code } = req.body;

        if (code === undefined || code === null) {
            res.status(400).json({
                success: false,
                message: "Code field is required",
                data: null
            });
            return;
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { code },
            { new: true }
        ).populate("admin", "_id username email")
         .populate("joinedUser", "_id username email");

        if (!updatedRoom) {
            res.status(404).json({
                success: false,
                message: "Room not found",
                data: null
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Room code updated successfully",
            data: updatedRoom
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server error",
            data: null
        });
    }
};

export const getUserRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find({
            $or: [
                { admin: req.userId },
                { joinedUser: req.userId }
            ]
        }).populate('admin', '_id username email')
          .populate('joinedUser', '_id username email');

        res.status(200).json({
            success: true,
            message: "Rooms fetched successfully",
            data: rooms
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server error",
            data: null
        });
    }
};

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId)
            .populate("admin", "_id username email")
            .populate("joinedUser", "_id username email");

        if (!room) {
            res.status(404).json({
                success: false,
                message: "Room not found",
                data: null
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Room fetched successfully",
            data: room
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server error",
            data: null
        });
    }
}

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId);

        if (!room) {
            res.status(404).json({
                success: false,
                message: "Room not found",
                data: null
            });
            return;
        }

        if (req.userId !== room.admin.toString()) {
            res.status(403).json({
                success: false,
                message: "Only room admins can delete the room",
                data: null
            });
            return;
        }

        await room.deleteOne();

        res.status(200).json({
            success: true,
            message: "Room deleted successfully",
            data: {
                roomId: room._id,
                name: room.name
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e instanceof Error ? e.message : "Internal server error",
            data: null
        });
    }
};
