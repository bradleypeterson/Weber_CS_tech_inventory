import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";

export async function salt(req: Request, res: Response) {
  const params: unknown = req.query;
  if (!validateParams(params)) {
    res.status(400).json({ status: "error", error: { message: "Invalid request body" } });
    return;
  }

  await new Promise((res) => setTimeout(res, 300));
  res.json({ status: "success", data: { salt: "salt" } });
}

const paramsSchema: JSONSchemaType<{ username: string }> = {
  type: "object",
  properties: {
    username: { type: "string" }
  },
  required: ["username"]
};

const validateParams = ajv.compile(paramsSchema);
