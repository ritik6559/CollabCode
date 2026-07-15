import { Prisma, RoomType } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { ApiError } from "../../common/api-error";
import {
    applySave,
    dropContent,
    getContent,
    seedContent,
} from "../storage/content-store";
import { sha256Hex } from "../storage/text-diff";
import { CreateRoomInput, UpdateRoomContentInput } from "./room.schema";

const userSelect = { id: true, username: true, email: true } as const;

const roomInclude = {
    admin: { select: userSelect },
    joinedUser: { select: userSelect },
} as const;

type RoomWithUsers = Prisma.RoomGetPayload<{ include: typeof roomInclude }>;
type PublicUser = { id: string; username: string; email: string };

/**
 * Serializers keep the wire format the frontend already speaks (`_id`,
 * populated user objects, lowercase room type) so the Mongo -> Postgres
 * migration is invisible to API consumers.
 */
const toPublicUser = (user: PublicUser) => ({
    _id: user.id,
    username: user.username,
    email: user.email,
});

const serializeRoom = (
    room: RoomWithUsers,
    content?: { text: string; yjsBase64: string | null; version: number }
) => ({
    _id: room.id,
    name: room.name,
    description: room.description,
    type: room.type === RoomType.DOC ? "doc" : "code",
    language: room.language ?? undefined,
    admin: toPublicUser(room.admin),
    joinedUser: room.joinedUser ? toPublicUser(room.joinedUser) : undefined,
    // Lists carry the denormalized preview; the detail view carries the
    // real content streamed out of the content store (cache -> S3).
    code: content ? content.text : room.preview ?? "",
    yjsState: content?.yjsBase64 ?? undefined,
    contentVersion: content ? content.version : room.contentVersion,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
});

export const createRoom = async (
    adminId: string,
    { name, description, type, language, code }: CreateRoomInput
) => {
    const room = await prisma.room.create({
        data: {
            name,
            description: description ?? "",
            type: type === "doc" ? RoomType.DOC : RoomType.CODE,
            language,
            adminId,
            ...(code
                ? {
                      contentVersion: 1,
                      contentHash: sha256Hex(code),
                      preview: code.slice(0, 500),
                  }
                : {}),
        },
        include: roomInclude,
    });

    if (code) {
        seedContent(room.id, code);
    }

    return serializeRoom(room);
};

export const joinRoom = async (roomId: string, userId: string) => {
    const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: roomInclude,
    });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    if (room.adminId === userId) {
        return { room: serializeRoom(room), message: "You are the admin" };
    }

    if (room.joinedUserId === userId) {
        return { room: serializeRoom(room), message: "You are already in this room" };
    }

    if (room.joinedUserId) {
        throw new ApiError(400, "Room is full. Only 2 users allowed (admin + 1 member)");
    }

    // Conditional update: the WHERE clause re-checks the seat is still empty,
    // so two concurrent joins can't both win (no read-then-write race).
    const claimed = await prisma.room.updateMany({
        where: { id: roomId, joinedUserId: null },
        data: { joinedUserId: userId },
    });

    if (claimed.count === 0) {
        throw new ApiError(400, "Room is full. Only 2 users allowed (admin + 1 member)");
    }

    const updated = await prisma.room.findUniqueOrThrow({
        where: { id: roomId },
        include: roomInclude,
    });

    return { room: serializeRoom(updated), message: "Successfully joined the room" };
};

export const leaveRoom = async (roomId: string, userId: string) => {
    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const isAdmin = room.adminId === userId;
    const isJoinedUser = room.joinedUserId === userId;

    if (!isAdmin && !isJoinedUser) {
        throw new ApiError(403, "Not authorized to leave this room");
    }

    let message: string;
    let data: Prisma.RoomUpdateInput;

    if (isAdmin) {
        if (!room.joinedUserId) {
            throw new ApiError(400, "Can't leave an empty room.");
        }

        data = {
            admin: { connect: { id: room.joinedUserId } },
            joinedUser: { disconnect: true },
        };
        message = "Left room and transferred admin rights to the other user";
    } else {
        data = { joinedUser: { disconnect: true } };
        message = "Left room successfully";
    }

    const updated = await prisma.room.update({
        where: { id: roomId },
        data,
        include: roomInclude,
    });

    return { room: serializeRoom(updated), message };
};

export const updateRoomContent = async (roomId: string, input: UpdateRoomContentInput) => {
    const room = await prisma.room.findUnique({
        where: { id: roomId },
        select: { id: true, contentVersion: true },
    });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const saved = await applySave(roomId, room.contentVersion, {
        baseVersion: input.baseVersion,
        full: input.full,
        splice: input.splice,
        contentHash: input.contentHash,
        yjsDelta: input.yjsDelta ? Buffer.from(input.yjsDelta, "base64") : undefined,
    });

    // Postgres is the version authority and gets updated synchronously;
    // the heavy S3 write is debounced inside the content store.
    await prisma.room.update({
        where: { id: roomId },
        data: {
            contentVersion: saved.version,
            contentHash: saved.contentHash,
            preview: saved.preview,
        },
    });

    return { version: saved.version };
};

export const getUserRooms = async (userId: string) => {
    const rooms = await prisma.room.findMany({
        where: {
            OR: [{ adminId: userId }, { joinedUserId: userId }],
        },
        include: roomInclude,
        orderBy: { updatedAt: "desc" },
    });

    return rooms.map((room) => serializeRoom(room));
};

export const getRoomById = async (roomId: string) => {
    const room = await prisma.room.findUnique({
        where: { id: roomId },
        include: roomInclude,
    });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const content = await getContent(room.id, room.contentVersion);

    return serializeRoom(room, content);
};

export const deleteRoom = async (roomId: string, userId: string) => {
    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    if (room.adminId !== userId) {
        throw new ApiError(403, "Only room admins can delete the room");
    }

    await prisma.room.delete({ where: { id: roomId } });
    await dropContent(roomId);

    return {
        roomId: room.id,
        name: room.name,
    };
};
