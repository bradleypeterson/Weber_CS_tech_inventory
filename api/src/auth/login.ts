import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { createToken } from ".";
import { ajv } from "../ajv";
import { getUserDetails } from "../db/procedures/auth";

export async function login(req: Request, res: Response) {
  const params: unknown = req.body;
  if (!validateParams(params)) {
    res.status(400).json({ status: "error", error: { message: "Invalid request" } });
    return;
  }

  const user = await getUserDetails(params.userId);
  if (user !== null && user.HashedPassword !== undefined && params.password === user.HashedPassword) {
    // Correct password
    delete user.HashedPassword;
    const token = createToken(user);
    res.json({ status: "success", data: { token, permissions: user.Permissions } });
    return;
  }

  res.status(400).json({ status: "error", error: { message: "Invalid UserId or Password" } });
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
