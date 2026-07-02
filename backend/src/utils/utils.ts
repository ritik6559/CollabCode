import jwt from "jsonwebtoken";
import { CookieOptions } from "express";
import { JWT_SECRET } from "./config";

export const generateToken = (userId: string) => {
    return jwt.sign({
        userId
    }, JWT_SECRET, {
        expiresIn: "24h"
    });
}

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "strict",
};