import { Router } from "express";
import { listAssetClasses } from "./list";
export const assetClassRouter = Router();

assetClassRouter.get("/list", listAssetClasses);
