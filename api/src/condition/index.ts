import { Router } from "express";
import { addConditionHandler } from "./add";
import { deleteConditionHandler } from "./delete";
import { listConditions } from "./list";
import { updateConditionHandler } from "./update";

export const conditionRouter = Router();

conditionRouter.get("/list", listConditions);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
conditionRouter.post("/add", addConditionHandler);
conditionRouter.post("/:id/update", updateConditionHandler);
conditionRouter.post("/:id/delete", deleteConditionHandler);
