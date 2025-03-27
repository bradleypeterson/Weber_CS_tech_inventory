import type { JSONSchemaType } from "ajv";
import type { Request, Response } from "express";
import { ajv } from "../ajv";
import { changePassword, getUserDetails } from "../db/procedures/auth";

export async function updatePassword(req: Request, res: Response) {
  const params: unknown = req.body;
  if (!validateParams(params)) {
    res.status(400).json({ status: "error", error: { message: "Invalid request" } });
    return;
  }

  if (params.updateType === "admin") {
    const user = await getUserDetails(params.userID);
    if (!user) {
      res.status(401).json({ status: "error", error: {message: "Invalid user" } });
      return;
    }
    await changePassword(params.userID, params.hashedNewPassword, params.newSalt);
    res.status(200).json({ status: "success", data: { userID: params.userID } });
    return;
  }
  else {
    try {
      const user = await getUserDetails(params.userID);
      if (!user) {
        res.status(401).json({ status: "error", error: {message: "Invalid user" } });
        return;
      }
      if (user.HashedPassword !== params.hashedOldPassword) {
        res.status(401).json({ status: "error", error: {message: "Invalid old password" }});
        return;
      }
    
      if ((params.updateType === "personal" && params.hashedOldPassword === user.HashedPassword)
        || (user.updateType === "admin")) 
      {
        await changePassword(params.userID.toString(), params.hashedNewPassword, params.newSalt);
        res.status(200).json({ status: "success", data: { userID: params.userID } });
        return;
      }
    } 
      catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error: Password change failed" });
        return;
    }
  }
}

const passwordParamsSchema: JSONSchemaType<{ userID: string; hashedOldPassword: string; hashedNewPassword: string; newSalt: string; updateType: string }> = {
  type: "object",
  properties: {
    userID: { type: "string" },
    hashedOldPassword: { type: "string" },
    hashedNewPassword: { type: "string" },
    newSalt: { type: "string" },
    updateType: { type: "string" }
  },
  required: ["userID", "hashedOldPassword", "hashedNewPassword", "newSalt", "updateType"]
};

const validateParams = ajv.compile(passwordParamsSchema);