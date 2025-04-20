import type { Request, Response } from "express";
import { deleteDepartment } from "../db/procedures/departments";

export async function deleteDepartmentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      res.status(400).json({ status: "error", error: { message: "Invalid department ID" } });
      return;
    }

    await deleteDepartment(Number(id));
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in deleteDepartment endpoint:", error);
    res.status(500).json({ status: "error", error: { message: "Could not delete department" } });
  }
}
