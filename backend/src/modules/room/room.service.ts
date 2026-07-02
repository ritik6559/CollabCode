import { ApiError } from "../../common/api-error";
import { Room } from "./room.model";
import { CreateRoomInput } from "./room.schema";

const USER_PUBLIC_FIELDS = "_id username email";

export const createRoom = async (adminId: string, { name, description, language }: CreateRoomInput) => {
    return Room.create({
        name,
        description: description ?? "",
        language,
        admin: adminId,
    });
};

export const joinRoom = async (roomId: string, userId: string) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    if (room.admin.toString() === userId) {
        return { room, message: "You are the admin" };
    }

    if (room.joinedUser?.toString() === userId) {
        return { room, message: "You are already in this room" };
    }

    if (room.joinedUser) {
        throw new ApiError(400, "Room is full. Only 2 users allowed (admin + 1 member)");
    }

    const updatedRoom = await Room.findByIdAndUpdate(
        roomId,
        { joinedUser: userId },
        { new: true }
    ).populate("admin", USER_PUBLIC_FIELDS)
     .populate("joinedUser", USER_PUBLIC_FIELDS);

    return { room: updatedRoom, message: "Successfully joined the room" };
};

export const leaveRoom = async (roomId: string, userId: string) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const isAdmin = userId === room.admin._id.toString();
    const isJoinedUser = userId === room.joinedUser?._id.toString();

    if (!isAdmin && !isJoinedUser) {
        throw new ApiError(403, "Not authorized to leave this room");
    }

    let message: string;

    if (isAdmin) {
        if (!room.joinedUser) {
            throw new ApiError(400, "Can't leave an empty room.");
        }

        room.admin = room.joinedUser;
        room.joinedUser = null;
        message = "Left room and transferred admin rights to the other user";
    } else {
        room.joinedUser = null;
        message = "Left room successfully";
    }

    await room.save();

    return { room, message };
};

export const updateRoomCode = async (roomId: string, code: string) => {
    const room = await Room.findByIdAndUpdate(
        roomId,
        { code },
        { new: true }
    ).populate("admin", USER_PUBLIC_FIELDS)
     .populate("joinedUser", USER_PUBLIC_FIELDS);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    return room;
};

export const getUserRooms = async (userId: string) => {
    return Room.find({
        $or: [
            { admin: userId },
            { joinedUser: userId }
        ]
    }).populate("admin", USER_PUBLIC_FIELDS)
      .populate("joinedUser", USER_PUBLIC_FIELDS);
};

export const getRoomById = async (roomId: string) => {
    const room = await Room.findById(roomId)
        .populate("admin", USER_PUBLIC_FIELDS)
        .populate("joinedUser", USER_PUBLIC_FIELDS);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    return room;
};

export const deleteRoom = async (roomId: string, userId: string) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    if (room.admin.toString() !== userId) {
        throw new ApiError(403, "Only room admins can delete the room");
    }

    await room.deleteOne();

    return {
        roomId: room._id,
        name: room.name,
    };
};
