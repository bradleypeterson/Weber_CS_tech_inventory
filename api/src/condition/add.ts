import type { Request, Response } from "express";
import type { Condition } from "../../../@types/data";
import { ajv } from "../ajv";
import { addCondition } from "../db/procedures/conditions";

const conditionSchema = {
  type: "object",
  properties: {
    ConditionName: { type: "string" },
    ConditionAbbreviation: { type: "string" }
  },
  required: ["ConditionName", "ConditionAbbreviation"],
  additionalProperties: false
};

const validateCondition = ajv.compile<Omit<Condition, "ConditionID">>(conditionSchema);

export async function addConditionHandler(req: Request, res: Response) {
  try {
    const condition: unknown = req.body;

    if (!validateCondition(condition)) {
      return res.status(400).json({
        status: "error",
        error: { message: "Invalid condition data", details: validateCondition.errors }
      });
    }

    await addCondition(condition);
    return res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in addCondition endpoint:", error);
    return res.status(500).json({
      status: "error",
      error: { message: "Could not add condition" }
    });
  }
}