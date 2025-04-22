import type { Request, Response } from "express";
import { deleteAssetClass } from "../db/procedures/assetClass";

export async function deleteAssetClassHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ status: "error", error: { message: "Invalid asset class ID" } });
      return;
    }

    await deleteAssetClass(Number(id));
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in deleteAssetClass endpoint:", error);
    res.status(500).json({ status: "error", error: { message: "Could not delete asset class" } });
  }
}
