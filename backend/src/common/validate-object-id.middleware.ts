import { RequestHandler } from "express";
import mongoose from "mongoose";
import { ApiError } from "./api-error";

export const validateObjectId = (paramName: string): RequestHandler =>
    (req, _res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
            next(new ApiError(400, `Invalid ${paramName} format`));
            return;
        }
        next();
    };
