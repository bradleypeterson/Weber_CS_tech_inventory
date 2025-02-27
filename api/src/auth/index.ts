import { Router } from "express";
import { sign } from "jsonwebtoken";
import { login } from "./login";
import { salt } from "./salt";
export const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/salt", salt);

export function createToken(detail: string | object) {
  return sign(detail, process.env.JWT_SECRET!, { expiresIn: "30d" });
}
