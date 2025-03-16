import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { dbUpdateContact } from "../db/procedures/contacts";

export async function updateContact(req: Request, res: Response) {
  try {
    const updates: unknown = req.body;
    const { id } = req.params;
    if (!validateUpdates(updates) || !id) {
      res.status(400).json({ status: "error", error: { message: "invalid updates" } });
      return;
    }

    await dbUpdateContact(Number(id), updates);
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in updateContact endpoint", error);
    res.status(500).json({ status: "error", error: { message: "An error occurred while updating contact" } });
  }
}

//TODO - update schema
const updateContactSchema: JSONSchemaType<
  Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
> = {
  type: "object",
  properties: {
    PersonID: { type: "number" },
    FirstName: { type: "string" },
    LastName: { type: "string" },
    DepartmentIDs: { type: "number" },
    LocationID: { type: "number" },
    RoomNumber: { type: "string" },
    Barcode: { type: "string" },
    BuildingName: { type: "string" },
    BuildingAbbr: { type: "string" },
  },
  required: [],
  additionalProperties: true
};

const validateUpdates = ajv.compile(updateContactSchema);