import jwt from "jsonwebtoken";
import { CookieOptions } from "express";
import { JWT_SECRET } from "../../utils/config";

export const AUTH_COOKIE = "token";

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "strict",
};

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};
