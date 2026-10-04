import { Router } from "express";
import { userRouter } from "./user.routes.ts";

const router = Router();

router.use("/users", userRouter);

export default router;
