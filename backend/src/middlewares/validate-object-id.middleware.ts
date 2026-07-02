import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = (paramName: string) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
            res.status(400).json({
                success: false,
                message: `Invalid ${paramName} format`,
                data: null
            });
            return;
        }
        next();
    };
