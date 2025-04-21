import { Router } from "express";
import { addDepartmentHandler } from "./add";
import { deleteDepartmentHandler } from "./delete";
import { listDepartments } from "./list";
import { updateDepartmentHandler } from "./update";

export const departmentRouter = Router();

departmentRouter.get("/list", listDepartments);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
departmentRouter.post("/add", addDepartmentHandler);
departmentRouter.post("/:id/update", updateDepartmentHandler);
departmentRouter.post("/:id/delete", deleteDepartmentHandler);
