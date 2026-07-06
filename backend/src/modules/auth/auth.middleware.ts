import { NextFunction, Request, Response } from "express";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/config";
import { ApiError } from "../../common/api-error";
import { AUTH_COOKIE } from "./auth.utils";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const validateToken = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.[AUTH_COOKIE];

    if (!token) {
        next(new ApiError(401, "No token provided"));
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;

        next();
    } catch (e) {

        if (e instanceof jwt.TokenExpiredError) {
            next(new ApiError(401, "Token has expired"));
            return;
        }

        next(new ApiError(401, "Invalid token"));
    }
};

/** Minimal cookie-header parser (avoids pulling extra deps for one value). */
const readCookie = (header: string | undefined, name: string): string | undefined => {
    if (!header) return undefined;

    for (const part of header.split(";")) {
        const [key, ...rest] = part.trim().split("=");
        if (key === name) {
            return decodeURIComponent(rest.join("="));
        }
    }
    return undefined;
};

/**
 * Socket.IO handshake authentication. Verifies the same httpOnly `token`
 * cookie the REST API uses and stores the userId on `socket.data`.
 * Unauthenticated sockets are rejected before any event handler runs.
 */
export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
    const token = readCookie(socket.handshake.headers.cookie, AUTH_COOKIE);

    if (!token) {
        next(new Error("Authentication required"));
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        socket.data.userId = decoded.userId;

        next();
    } catch {
        next(new Error("Invalid or expired token"));
    }
};
