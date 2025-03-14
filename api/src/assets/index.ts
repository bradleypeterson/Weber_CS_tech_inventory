import { Router } from "express";
import { listAssetOverviews, listAssets } from "./list";
export const assetRouter = Router();

assetRouter.get("/list", listAssets);
assetRouter.get("/list/overview", listAssetOverviews);
