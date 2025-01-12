import { JSONSchemaType } from "ajv";
import { Request, Response } from "express";
import { ajv } from "../ajv";
import { pool } from "../db";

export async function syncAssets(req: Request, res: Response): Promise<void> {
  const query = req.query;
  if (!validateQueryParams(query)) {
    res.status(400).json({ error: "Missing lastSync in query" });
    return;
  }

  try {
    const updatedAssetRowQuery = `
    select tag_number, status, department, description, detailed_description, serial_num, asset_type, last_updated 
    from assets 
    where last_updated > ?
  `;

    const [results] = await pool.query(updatedAssetRowQuery, [query.lastSync]);
    console.log(results);

    res.status(200).json({ results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get sync data" });
  }
}

type Query = {
  lastSync: string;
};

const validateQueryParamsSchema: JSONSchemaType<Query> = {
  type: "object",
  properties: {
    lastSync: { type: "string" }
  },
  required: ["lastSync"]
};

const validateQueryParams = ajv.compile(validateQueryParamsSchema);
