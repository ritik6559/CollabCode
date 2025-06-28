import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
             res.status(401).json({
                success: false,
                message: "No token provided",
            });
             return
        }

        const token = authHeader.split(" ")[1];

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, secret) as { userId: string };

        req.userId = decoded.userId;

        next();
    } catch (err) {
        console.log(err);
         res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
