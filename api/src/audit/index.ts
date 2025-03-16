import { Router } from "express";
import { getEquipmentForRoom } from "./equipment";
import { initiateAudit } from "./initiate";
import { scanItem } from "./scan-item";

export const auditRouter = Router();

auditRouter.post("/initiate", initiateAudit);
auditRouter.get("/equipment/:roomId", getEquipmentForRoom);
auditRouter.post("/scan-item", scanItem); 