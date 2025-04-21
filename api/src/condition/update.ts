import type { Request, Response } from "express";
import type { Condition } from "../../../@types/data";
import { ajv } from "../ajv";
import { updateCondition } from "../db/procedures/conditions";

export async function updateConditionHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const condition = req.body as Partial<Condition>;

    if (!id || isNaN(Number(id)) || !validateCondition(condition)) {
      res.status(400).json({ status: "error", error: { message: "Invalid condition data" } });
      return;
    }

    // Ensure the ID in the URL matches the object
    condition.ConditionID = Number(id);

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    await updateCondition(condition as Condition);
    res.json({ status: "success", data: {} });
  } catch (error) {
    console.error("Error in updateCondition endpoint:", error);
    res.status(500).json({ status: "error", error: { message: "Could not update condition" } });
  }
}

const conditionSchema = {
  type: "object",
  properties: {
    ConditionName: { type: "string" },
    ConditionAbbreviation: { type: "string" },
    ConditionID: { type: "number" }
  },
  required: ["ConditionName", "ConditionAbbreviation"]
};

const validateCondition = ajv.compile(conditionSchema);
