import type { Request, Response } from "express";
import type { Department } from "../../../@types/data";
import { ajv } from "../ajv";
import { updateDepartment } from "../db/procedures/departments";

export async function updateDepartmentHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const department = req.body as Partial<Department>;

    if (!id || isNaN(Number(id)) || !validateDepartment(department)) {
      res.status(400).json({ status: "error", error: { message: "Invalid department data" } });
      return;
    }

    // Ensure the ID in the URL matches the object
    department.DepartmentID = Number(id);

    await updateDepartment(department as Department);
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in updateDepartment endpoint:", error);
    res.status(500).json({ status: "error", error: { message: "Could not update department" } });
  }
}

const departmentSchema = {
  type: "object",
  properties: {
    Name: { type: "string" },
    Abbreviation: { type: "string" },
    DepartmentID: { type: "number" }
  },
  required: ["Name", "Abbreviation"]
};

const validateDepartment = ajv.compile(departmentSchema);
