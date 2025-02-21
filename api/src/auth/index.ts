import { Router } from "express";
import { login } from "./login";
import { salt } from "./salt";
export const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/salt", salt);
