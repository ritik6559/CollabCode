import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: "No token provided",
            });
            return;
        }

        const secret = JWT_SECRET;

        if (!secret) {
            throw new Error("secret not defined");
        }

        const decoded = jwt.verify(token, secret) as { userId: string };
        req.userId = decoded.userId;

        next();
    } catch (e) {
        console.log(e);

        if (e instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Token has expired",
            });
            return;
        }

        if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }

        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};