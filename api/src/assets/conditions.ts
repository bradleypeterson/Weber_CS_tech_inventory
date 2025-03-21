import type { Request, Response } from "express";
import { getAllConditions } from "../db/procedures/assets";

export async function getConditions(req: Request, res: Response) {
  try {
    const rows = await getAllConditions();
    res.json({ status: "success", data: rows });
  } catch (error) {
    console.error(`Error in getAllConditions endpoint:`, error);
    res.status(500).json({ status: "error", error: { message: "Could not list all conditions" } });
  }
}
