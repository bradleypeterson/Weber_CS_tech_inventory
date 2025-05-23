import type { Request, Response } from "express";
import { getAllAssets, getAllAssetsOverview } from "../db/procedures/assets";

export async function listAssets(req: Request, res: Response) {
  try {
    const rows = await getAllAssets();
    res.json({ status: "success", data: rows });
  } catch (error) {
    console.error(`Error in listAssets endpoint:`, error);
    res.status(500).json({ status: "error", error: { message: "Could not list all assets" } });
  }
}

export async function listAssetOverviews(req: Request, res: Response) {
  try {
    const rows = await getAllAssetsOverview();
    res.json({ status: "success", data: rows });
  } catch (error) {
    console.error(`Error in listAssetOverviews endpoint:`, error);
    res.status(500).json({ status: "error", error: { message: "Could not list all assets" } });
  }
}
