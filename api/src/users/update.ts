import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { dbUpdateUser } from "../db/procedures/users";

export async function updateUser(req: Request, res: Response) {
  try {
    const updates: unknown = req.body;
    const { id } = req.params;
    if (!validateUpdates(updates) || !id) {
      res.status(400).json({ status: "error", error: { message: "invalid updates" } });
      return;
    }

    await dbUpdateUser(Number(id), updates);
    res.status(200).json({ status: "success", data: {}});
    return;

  } catch (error) {
    console.error("Error in updateUser endpoint", error);
    res.status(500).json({ status: "error", error: { message: "An error occurred while updating user" } });
    return;
  }
}

const updateUserSchema: JSONSchemaType<
  Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
> = {
  type: "object",
  properties: {
    WNumber: {type: "string"},
    FirstName: { type: "string" },
    LastName: { type: "string" },
    DepartmentID: { type: "array", items: { type: "number" } },
    BuildingID: { type: "number" },
    LocationID: { type: "number"},
    Permissions: { type: "array", items: { type: "number" } },
  },
  required: [],
  additionalProperties: true
};

const validateUpdates = ajv.compile(updateUserSchema);