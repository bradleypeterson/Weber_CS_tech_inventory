import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { pool } from "../db";

export async function salt(req: Request, res: Response) {
  const params: unknown = req.query;
  if (!validateParams(params)) {
    res.status(400).json({ status: "error", error: { message: "Invalid request body" } });
    return;
  }

  const query = `select Salt from User where UserID = ?`;
  const [rows] = await pool.query(query, [params.username]);

  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(404).json({ status: "error", error: { message: "User not found" } });
    return;
  }

  const firstRow = rows[0];

  if (!validateResult(firstRow)) {
    res.status(500).json({ status: "error", error: { message: "Unexpected database result" } });
    return;
  }

  res.json({ status: "success", data: { salt: firstRow.Salt } });
}

const paramsSchema: JSONSchemaType<{ username: string }> = {
  type: "object",
  properties: {
    username: { type: "string" }
  },
  required: ["username"]
};

const validateParams = ajv.compile(paramsSchema);

const resultData: JSONSchemaType<{ Salt: string }> = {
  type: "object",
  properties: {
    Salt: { type: "string" }
  },
  required: ["Salt"]
};

const validateResult = ajv.compile(resultData);
