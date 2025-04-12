import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { dbAddContact } from "../db/procedures/contacts";

export async function addContact(req: Request, res: Response) {
  try {
    const params: unknown = req.body;
    if (!validateUpdates(params)) {
      res.status(400).json({ status: "error", error: { message: "Invalid contact to add" } });
      return;
    }

    await dbAddContact(params.WNumber, params.FirstName, params.LastName,
      params.DepartmentID, params.BuildingID, params.LocationID
    );
    res.status(200).json({ status: "success", data: { WNumber: params.WNumber } });
    return;

  } catch (error) {
    console.error("Error in addContact endpoint", error);
    res.status(500).json({ status: "error", error: { message: "An error occurred while adding contact" } });
  }
}

const addContactParamsSchema: JSONSchemaType<{
  WNumber: string; FirstName: string; LastName: string; 
  DepartmentID: number[]; BuildingID: number; LocationID: number;
}> = {
  type: "object",
  properties: {
    WNumber: { type: "string" },
    FirstName: { type: "string" },
    LastName: { type: "string" },
    DepartmentID: { type: "array", items: { type: "number" } },
    BuildingID: { type: "number"},
    LocationID: { type: "number"},
    },
    required: ["WNumber", "FirstName", "LastName", "DepartmentID", "BuildingID", "LocationID"],
};
const validateUpdates = ajv.compile(addContactParamsSchema);