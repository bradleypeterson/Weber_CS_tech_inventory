import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { pool } from "../db";

export async function listAssets(req: Request, res: Response) {
  const query = `select EquipmentID, TagNumber from Equipment`;
  const [rows] = await pool.query(query);
  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(404).json({ status: "error", error: { message: "Could not find assets" } });
    return;
  }

  if (!validateRows(rows)) {
    console.log(validateRows.errors);
    res.status(500).json({ status: "error", error: { message: "Unexpected database response" } });
    return;
  }

  res.json({ status: "success", data: rows });
}

const validateRowsSchema: JSONSchemaType<{ EquipmentID: number; TagNumber: string }[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      EquipmentID: { type: "number" },
      TagNumber: { type: "string" }
    },
    required: ["EquipmentID", "TagNumber"]
  }
};

const validateRows = ajv.compile(validateRowsSchema);
