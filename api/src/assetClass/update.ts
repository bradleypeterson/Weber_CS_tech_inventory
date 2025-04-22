import type { Request, Response } from "express";
import type { AssetClass } from "../../../@types/data";
import { ajv } from "../ajv";
import { updateAssetClass } from "../db/procedures/assetClass";

export async function updateAssetClassHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const assetClass = req.body as Partial<AssetClass>;

    if (!id || isNaN(Number(id)) || !validateAssetClass(assetClass)) {
      res.status(400).json({ status: "error", error: { message: "Invalid asset class data" } });
      return;
    }

    assetClass.AssetClassID = Number(id);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    await updateAssetClass(assetClass as AssetClass);
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in updateAssetClass endpoint:", error);
    res.status(500).json({ status: "error", error: { message: "Could not update asset class" } });
  }
}

const assetClassSchema = {
  type: "object",
  properties: {
    Name: { type: "string" },
    Abbreviation: { type: "string" },
    AssetClassID: { type: "number" }
  },
  required: ["Name", "Abbreviation"]
};

const validateAssetClass = ajv.compile(assetClassSchema);
