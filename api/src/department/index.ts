import { Router } from "express";
import { listDepartments } from "./list";
export const departmentRouter = Router();

departmentRouter.get("/list", listDepartments);
