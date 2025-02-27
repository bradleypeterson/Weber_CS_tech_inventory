import { Router } from "express";
import { listAssets } from "./list";
export const assetRouter = Router();

assetRouter.get("/list", listAssets);
