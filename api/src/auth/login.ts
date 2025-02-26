import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";

export async function login(req: Request, res: Response) {
  const params: unknown = req.body;
  if (!validateParams(params)) {
    res.status(400).json({ status: "error", error: { message: "Invalid request" } });
    return;
  }

  await new Promise((res) => setTimeout(res, 300));
  res.json({ status: "success", data: { token: "example" } });
}

const paramsSchema: JSONSchemaType<{ userId: string; password: string }> = {
  type: "object",
  properties: {
    userId: { type: "string" },
    password: { type: "string" }
  },
  required: ["password", "userId"]
};

const validateParams = ajv.compile(paramsSchema);
