import { RequestHandler } from "express";
import { ZodTypeAny } from "zod";
import { ApiError } from "./api-error";


export const validateBody = (schema: ZodTypeAny): RequestHandler =>
    (req, _res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            next(new ApiError(400, result.error.issues[0]?.message ?? "Invalid request body"));
            
            return;
        }

        req.body = result.data;
        next();
    };
