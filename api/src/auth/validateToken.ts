import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ status: "error", error: { message: "Unauthenticated" } });
    return;
  }

  try {
    const user = verify(token, process.env.JWT_SECRET!);
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(401).json({ status: "error", error: { message: "Unauthenticated" } });
    return;
  }
}
