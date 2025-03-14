import { type Request, type Response, Router } from "express";
import { getAssetDetails } from "../db/procedures/assets";
import { listAssetOverviews, listAssets } from "./list";
export const assetRouter = Router();

assetRouter.get("/list", listAssets);
assetRouter.get("/list/overview", listAssetOverviews);
assetRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const asset = await getAssetDetails(Number(id));
    if (asset === undefined) {
      res.json(404).json({ status: "error", error: { message: "Asset does not exist" } });
      return;
    }
    res.json({ status: "success", data: asset });
  } catch (error) {
    console.error(`Error in listAssetOverviews endpoint:`, error);
    res.status(500).json({ status: "error", error: { message: "Could not list all assets" } });
  }
});
