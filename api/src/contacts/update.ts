import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { dbUpdateContact } from "../db/procedures/contacts";

export async function updateContact(req: Request, res: Response) {
  try {
    const params: unknown = req.body;
    if (!validateUpdates(params)) {
      res.status(400).json({ status: "error", error: { message: "Invalid updates" } });
      return;
    }

    await dbUpdateContact(params.personID, params.WNumber, params.FirstName, params.LastName,
      params.DepartmentID, params.BuildingID, params.RoomNumber
    );
    res.status(200).json({ status: "success", data: { personID: params.personID } });
    return;

  } catch (error) {
    console.error("Error in updateContact endpoint", error);
    res.status(500).json({ status: "error", error: { message: "An error occurred while updating contact" } });
  }
}


const updateContactParamsSchema: JSONSchemaType<{
  personID: string; WNumber: string; FirstName: string; LastName: string; 
  DepartmentID: number[]; BuildingID: number; RoomNumber: string
}> = {
  type: "object",
  properties: {
    personID: { type: "string" },
    WNumber: { type: "string" },
    FirstName: { type: "string" },
    LastName: { type: "string" },
    DepartmentID: { type: "array", items: { type: "number" } },
    BuildingID: { type: "number"},
    RoomNumber: { type: "string"},
    },
    required: ["personID", "WNumber", "FirstName", "LastName", "DepartmentID", "BuildingID", "RoomNumber"],
};
const validateUpdates = ajv.compile(updateContactParamsSchema);