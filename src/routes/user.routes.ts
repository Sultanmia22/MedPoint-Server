import { Router } from "express";
import { userRegister } from "../controller/user.controller.ts";

const userRouter = Router();

userRouter.post("/register", userRegister);

export { userRouter };
