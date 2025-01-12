import { Router } from "express";
import { syncAssets } from "./assets";
export const syncRouter = Router();

syncRouter.get("/assets", syncAssets);
