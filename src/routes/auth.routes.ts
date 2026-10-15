import { Router } from "express";
import { userRegister } from "../controller/auth/register.controller.ts";
import { userlogin } from "../controller/auth/login.controller.ts";
import { refresh } from "../controller/auth/refresh.controller.ts";

const authRouter = Router();

authRouter.post("/register", userRegister);
authRouter.post("/login", userlogin );
authRouter.post("/refresh", refresh);

export { authRouter };
