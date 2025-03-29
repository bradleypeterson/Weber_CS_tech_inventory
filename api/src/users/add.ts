import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { dbAddUser } from "../db/procedures/users";

export async function addUser(req: Request, res: Response) {
  try {
    const details: unknown = req.body;
    if (!validateDetails(details)) {
      res.status(400).json({ status: "error", error: { message: "Invalid user to add" } });
      return;
    }
    console.log(details);
    await dbAddUser(details);
    res.status(200).json({ status: "success", data: {} });
    return;

  } catch (error) {
    console.error("Error in addContact endpoint", error);
    res.status(500).json({ status: "error", error: { message: "An error occurred while adding contact" } });
  }
}

const addSchema: JSONSchemaType<
  Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
> = {
  type: "object",
  properties: {
    hashedNewPassword: { type: "string"},
    Salt: {type: "string"},
    WNumber: { type: "string" },
    FirstName: { type: "string" },
    LastName: { type: "string" },
    DepartmentID: { type: "array", items: { type: "number" } },
    BuildingID: { type: "number"},
    RoomNumber: { type: "string"},
    Permissions: { type: "array", items: { type: "number" } },
  },
  required: [],
  additionalProperties: true
};

const validateDetails = ajv.compile(addSchema);