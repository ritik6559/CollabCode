import express from "express";
import {getCurrentUser, login, logout, register} from "../controllers/auth.controller";
import { validateToken } from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", validateToken, getCurrentUser);

export default authRouter;
