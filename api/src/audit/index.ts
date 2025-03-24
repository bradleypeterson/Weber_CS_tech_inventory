import { RequestHandler, Router } from "express";
import { getEquipmentForRoom } from "./equipment";
import { getAuditHistory } from "./history";
import { initiateAudit } from "./initiate";
import { scanItem } from "./scan-item";
import { submitAudit } from "./submit";

export const auditRouter = Router();

// Define routes with proper typing
auditRouter.post("/initiate", initiateAudit as RequestHandler);
auditRouter.get("/equipment/:roomId", getEquipmentForRoom as RequestHandler);
auditRouter.post("/scan-item", scanItem as RequestHandler);
auditRouter.post("/submit", submitAudit as RequestHandler);
auditRouter.get("/history", getAuditHistory as RequestHandler);