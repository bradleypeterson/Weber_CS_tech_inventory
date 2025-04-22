import { Router } from "express";
import { addDeviceTypeHandler } from "./add";
import { deleteDeviceTypeHandler } from "./delete";
import { listDeviceTypes } from "./list";
import { updateDeviceTypeHandler } from "./update";

export const deviceTypeRouter = Router();

deviceTypeRouter.get("/list", listDeviceTypes);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
deviceTypeRouter.post("/add", addDeviceTypeHandler);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
deviceTypeRouter.post("/:id/update", updateDeviceTypeHandler);
deviceTypeRouter.post("/:id/delete", deleteDeviceTypeHandler);
