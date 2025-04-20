import type { Request, Response } from "express";
import { deleteCondition } from "../db/procedures/conditions";

export async function deleteConditionHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ status: "error", error: { message: "Invalid condition ID" } });
      return;
    }

    await deleteCondition(Number(id));
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in deleteCondition endpoint:", error);
    res.status(500).json({ status: "error", error: { message: "Could not delete condition" } });
  }
}