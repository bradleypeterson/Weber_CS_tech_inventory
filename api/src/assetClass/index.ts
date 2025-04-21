import { Router } from "express";
import { addAssetClassHandler } from "./add";
import { deleteAssetClassHandler } from "./delete";
import { listAssetClasses } from "./list";
import { updateAssetClassHandler } from "./update";

export const assetClassRouter = Router();

assetClassRouter.get("/list", listAssetClasses);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
assetClassRouter.post("/add", addAssetClassHandler);
assetClassRouter.post("/:id/update", updateAssetClassHandler);
assetClassRouter.post("/:id/delete", deleteAssetClassHandler);
