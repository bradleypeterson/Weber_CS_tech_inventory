import type { Request, Response } from "express";
import type { AssetClass } from "../../../@types/data";
import { ajv } from "../ajv";
import { addAssetClass } from "../db/procedures/assetClasses";

const assetClassSchema = {
  type: "object",
  properties: {
    Name: { type: "string" },
    Abbreviation: { type: "string" }
  },
  required: ["Name", "Abbreviation"],
  additionalProperties: false
};

const validateAssetClass = ajv.compile<Omit<AssetClass, "AssetClassID">>(assetClassSchema);

export async function addAssetClassHandler(req: Request, res: Response) {
  try {
    const assetClass: unknown = req.body;

    if (!validateAssetClass(assetClass)) {
      return res.status(400).json({
        status: "error",
        error: { message: "Invalid asset class data", details: validateAssetClass.errors }
      });
    }

    await addAssetClass(assetClass);
    return res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in addAssetClass endpoint:", error);
    return res.status(500).json({
      status: "error",
      error: { message: "Could not add asset class" }
    });
  }
}
