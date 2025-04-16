import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { dbUpdateAsset } from "../db/procedures/assets";

export async function updateAsset(req: Request, res: Response) {
  try {
    const updates: unknown = req.body;
    const { id } = req.params;
    if (!validateUpdates(updates) || !id) {
      res.status(400).json({ status: "error", error: { message: "invalid updates" } });
      return;
    }

    await dbUpdateAsset(Number(id), updates);
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in updateAsset endpoint", error);
    res.status(500).json({ status: "error", error: { message: "An error occurred while update asset." } });
  }
}

const updateSchema: JSONSchemaType<
  Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
> = {
  type: "object",
  properties: {
    EquipmentID: { type: "number" },
    TagNumber: { type: "string" },
    SerialNumber: { type: "string" },
    Description: { type: "string" },
    DepartmentID: { type: "number" },
    DepartmentName: { type: "string" },
    LocationID: { type: "number" },
    RoomNumber: { type: "string" },
    Barcode: { type: "string" },
    BuildingName: { type: "string" },
    BuildingAbbr: { type: "string" },
    ContactPersonID: { type: "number" },
    ContactPersonFirstName: { type: "string" },
    ContactPersonLastName: { type: "string" },
    AssetClassID: { type: "number" },
    AssetClassName: { type: "string" },
    FiscalYearID: { type: "number" },
    FiscalYear: { type: "string" },
    ConditionID: { type: "number" },
    ConditionName: { type: "string" },
    DeviceTypeID: { type: "number" },
    DeviceTypeName: { type: "string" },
    Manufacturer: { type: "string" },
    PartNumber: { type: "string" },
    Rapid7: { type: "number", enum: [1, 0] },
    CrowdStrike: { type: "number", enum: [1, 0] },
    ArchiveStatus: { type: "number", enum: [1, 0] },
    PONumber: { type: "string" },
    SecondaryNumber: { type: "string" },
    AccountingDate: { type: "string" },
    AccountCost: { type: "number" }
  },
  required: [],
  additionalProperties: true
};

const validateUpdates = ajv.compile(updateSchema);
