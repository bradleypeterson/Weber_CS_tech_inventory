import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { addAsset, type AddAssetParams } from "../db/procedures/assets";

export async function addAssetHandler(req: Request, res: Response) {
  try {
    const params: unknown = req.body;
    if (validateParams(params) === false) {
      console.error(validateParams.errors);
      res.status(400).json({ status: "error", error: { message: "invalid equipment information" } });
      return;
    }

    await addAsset(params);
    res.json({ status: "success", data: {} });
  } catch (e) {
    res.status(500).json({ status: "error", error: { message: "An error occurred while adding an asset" } });
  }
}

const paramsSchema: JSONSchemaType<AddAssetParams> = {
  type: "object",
  properties: {
    TagNumber: { type: "string", maxLength: 16 },
    SerialNumber: { type: "string", maxLength: 32 },
    Description: { type: "string", maxLength: 64, nullable: true },
    ContactPersonID: { type: "integer", minimum: 1, nullable: true },
    LocationID: { type: "integer", minimum: 1, nullable: true },
    DepartmentID: { type: "integer", minimum: 1, nullable: true },
    AssetClassID: { type: "integer", minimum: 1 },
    FiscalYearID: { type: "integer", minimum: 1, nullable: true },
    ConditionID: { type: "integer", minimum: 1 },
    DeviceTypeID: { type: "integer", minimum: 1 },
    Manufacturer: { type: "string", maxLength: 25, nullable: true },
    PartNumber: { type: "string", maxLength: 50, nullable: true },
    Rapid7: { type: "boolean", nullable: true },
    CrowdStrike: { type: "boolean", nullable: true },
    ArchiveStatus: { type: "boolean", nullable: true },
    PONumber: { type: "string", maxLength: 50, nullable: true },
    SecondaryNumber: { type: "string", maxLength: 32, nullable: true },
    AccountingDate: {
      type: "string",
      nullable: true
    },
    AccountCost: {
      type: "number",
      minimum: 0,
      nullable: true
    }
  },
  required: ["TagNumber", "SerialNumber", "AssetClassID", "ConditionID", "DeviceTypeID"]
};

const validateParams = ajv.compile(paramsSchema);
