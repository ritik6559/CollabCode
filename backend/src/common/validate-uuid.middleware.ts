import { RequestHandler } from "express";
import { ApiError } from "./api-error";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateUuid = (paramName: string): RequestHandler =>
    (req, _res, next) => {
        if (!UUID_RE.test(req.params[paramName])) {
            next(new ApiError(400, `Invalid ${paramName} format`));
            return;
        }
        next();
    };
