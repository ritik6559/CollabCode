import { Response } from "express";
import { asyncHandler } from "../../common/async-handler";
import * as authService from "./auth.service";
import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS, generateToken } from "./auth.utils";

const issueAuthCookie = (res: Response, userId: string) => {
    res.cookie(AUTH_COOKIE, generateToken(userId), AUTH_COOKIE_OPTIONS);
};

export const register = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);

    issueAuthCookie(res, String(user._id));

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
    });
});

export const login = asyncHandler(async (req, res) => {
    const user = await authService.loginUser(req.body);

    issueAuthCookie(res, String(user._id));

    res.status(200).json({
        success: true,
        message: "Successfully logged in",
        data: user,
    });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.userId!);

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});

export const logout = asyncHandler(async (_req, res) => {
    res.clearCookie(AUTH_COOKIE);

    res.status(200).json({
        success: true,
        message: "Successfully logged out",
        data: null,
    });
});
