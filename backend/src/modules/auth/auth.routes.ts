import express from "express";
import { getCurrentUser, login, logout, register } from "./auth.controller";
import { validateToken } from "./auth.middleware";
import { validateBody } from "../../common/validate.middleware";
import { createUserSchema, loginUserSchema } from "./auth.schema";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.delete("/logout", logout);
authRouter.get("/me", validateToken, getCurrentUser);

export default authRouter;
