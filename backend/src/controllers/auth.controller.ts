import { Request, Response } from "express";
import {User} from "../models/user.model";
import {createUserSchema, loginUserSchema} from "../utils/schema";
import bcrypt from "bcryptjs";
import {generateToken} from "../utils/utils";

export const register = async ( req: Request, res: Response ) => {
    try{

        const verify = createUserSchema.safeParse(req.body);

        if( !verify.success ) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
                data: null
            });
            return;
        }

        const { email, password, username } = verify.data;

        const user = await User.findOne({
            email: verify.data.email
        });

        if( user ) {
            res.status(400).json({
                success: false,
                message: "User with email " +  email + " already exists",
                data: null
            });
            return;
        }

        const newUser = await User.create({
            username,
            email,
            password
        });

        const token = generateToken(newUser._id.toString());

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser,
            token
        });

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: e,
            data: null
        });
    }
}

export const login = async ( req: Request, res: Response ) => {
    try{

        const verify = loginUserSchema.safeParse(req.body);

        if( !verify.success ) {
            res.status(400).json({
                success: false,
                message: "All fields are required",
                data: null
            });
            return;
        }

        const { email, password } = verify.data;

        const user = await User.findOne({
            email
        });

        if( !user ) {
            res.status(400).json({
                success: false,
                message: "User not found",
                data: null
            });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if( !isPasswordCorrect ) {
            res.status(400).json({
                success: false,
                message: "Incorrect password",
                data: null
            });
            return;
        }

        const token  = generateToken(user._id.toString());

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: "Successfully logged in",
            data: user,
            token
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: e,
            data: null
        });
    }
}

export const logout = async (req: Request, res: Response) => {
    try{

        res.clearCookie('token');

        res.status(200).json({
            success: true,
            message: "Successfully logged out",
            data: null
        });

    } catch(e) {
        res.status(500).json({
            success: false,
            message: e,
            data: null
        });
    }
}