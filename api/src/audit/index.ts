import { Router } from "express";
import { getEquipmentForRoom } from "./equipment";
import { getAuditHistory } from "./history";
import { initiateAudit } from "./initiate";
import { scanItem } from "./scan-item";
import { submitAudit } from "./submit";

export const auditRouter = Router();

auditRouter.post("/initiate", initiateAudit);
auditRouter.get("/equipment/:roomId", getEquipmentForRoom);
auditRouter.post("/scan-item", scanItem);
auditRouter.post("/submit", submitAudit);
auditRouter.get("/history", getAuditHistory); 