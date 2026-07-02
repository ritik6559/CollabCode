import { NextFunction, Request, Response } from "express";
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
