import { Router } from "express";
import { listBuildings } from "./list";
export const buildingRouter = Router();

buildingRouter.get("/list", listBuildings);