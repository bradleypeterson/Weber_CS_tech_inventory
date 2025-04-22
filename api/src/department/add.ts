import type { Request, Response } from "express";
import type { Department } from "../../../@types/data";
import { ajv } from "../ajv";
import { addDepartment } from "../db/procedures/departments";

const departmentSchema = {
  type: "object",
  properties: {
    Name: { type: "string" },
    Abbreviation: { type: "string" }
  },
  required: ["Name", "Abbreviation"],
  additionalProperties: false
};

const validateDepartment = ajv.compile<Omit<Department, "DepartmentID">>(departmentSchema);

export async function addDepartmentHandler(req: Request, res: Response) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const department = req.body;

    if (!validateDepartment(department)) {
      return res.status(400).json({
        status: "error",
        error: { message: "Invalid department data", details: validateDepartment.errors }
      });
    }

    await addDepartment(department);
    return res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in addDepartment endpoint:", error);
    return res.status(500).json({
      status: "error",
      error: { message: "Could not add department" }
    });
  }
}
