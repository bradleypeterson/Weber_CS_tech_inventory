import { Router } from "express";
import { listUsers } from "./list";
export const userRouter = Router();

userRouter.get("/list", listUsers);
