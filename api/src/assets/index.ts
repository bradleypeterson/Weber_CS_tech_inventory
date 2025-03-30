import { type Request, type Response, Router } from "express";
import { getAssetDetails } from "../db/procedures/assets";
import { addAssetHandler } from "./add";
import { listAssetOverviews, listAssets } from "./list";
import { getConditions, getDeviceTypes } from "./options";
import { updateAsset } from "./update";
export const assetRouter = Router();

assetRouter.post("/add", addAssetHandler);
assetRouter.get("/conditions", getConditions);
assetRouter.get("/types", getDeviceTypes);
assetRouter.get("/list", listAssets);
assetRouter.get("/list/overview", listAssetOverviews);
assetRouter.post("/:id/update", updateAsset);
assetRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const asset = await getAssetDetails(Number(id));
    if (asset === undefined) {
      res.status(404).json({ status: "error", error: { message: "Asset does not exist" } });
      return;
    }
    res.json({ status: "success", data: asset });
  } catch (error) {
    console.error(`Error in listAssetOverviews endpoint:`, error);
    res.status(500).json({ status: "error", error: { message: "Could not list all assets" } });
  }
});
