import type { Request, Response } from "express";
import { deleteDeviceType } from "../db/procedures/deviceTypes";

export async function deleteDeviceTypeHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ status: "error", error: { message: "Invalid device type ID" } });
      return;
    }

    await deleteDeviceType(Number(id));
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in deleteDeviceType endpoint:", error);
    res.status(500).json({ status: "error", error: { message: "Could not delete device type" } });
  }
}
