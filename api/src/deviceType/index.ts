import { Router } from "express";
import { addDeviceTypeHandler } from "./add";
import { deleteDeviceTypeHandler } from "./delete";
import { listDeviceTypes } from "./list";
import { updateDeviceTypeHandler } from "./update";

export const deviceTypeRouter = Router();

deviceTypeRouter.get("/list", listDeviceTypes);
// @ts-ignore
deviceTypeRouter.post("/add", addDeviceTypeHandler);
// @ts-ignore
deviceTypeRouter.post("/:id/update", updateDeviceTypeHandler);
deviceTypeRouter.post("/:id/delete", deleteDeviceTypeHandler);