import { Router } from "express";
import { listRooms } from "./list";
export const roomRouter = Router();

roomRouter.get("/list", listRooms);
