import { Router } from "express";
import { getEquipmentForRoom } from "./equipment";
import { initiateAudit } from "./initiate";

export const auditRouter = Router();

auditRouter.post("/initiate", initiateAudit);
auditRouter.get("/equipment/:roomId", getEquipmentForRoom); 