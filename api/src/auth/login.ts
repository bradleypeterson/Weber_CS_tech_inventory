import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";

export async function login(req: Request, res: Response) {
  const params: unknown = req.body;
  if (!validateParams(params)) {
    res.status(400).json({ status: "error", error: { message: "Invalid request body" } });
    return;
  }

  await new Promise((res) => setTimeout(res, 300));
  res.json({ status: "success", data: { token: "example" } });
}

const paramsSchema: JSONSchemaType<{ username: string; password: string }> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" }
  },
  required: ["password", "username"]
};

const validateParams = ajv.compile(paramsSchema);
