import type { Request, Response } from "express";
import { createNewAudit } from "../db/procedures/audits";

interface RequestUser {
  userId: number;
}

interface AuditSubmission {
  roomId: number;
  itemStatuses: Record<number, number>;
  notes: Record<number, string>;
}

export async function submitAudit(req: Request<{}, {}, AuditSubmission>, res: Response) {
  try {
    const user = (req as any).user as RequestUser;
    const { itemStatuses, notes } = req.body;

    // Create a single timestamp for the entire audit session
    const auditTime = new Date();

    // Process each item in the audit with the same timestamp
    const promises = Object.entries(itemStatuses).map(([equipmentId, statusId]) => {
      const note = notes[Number(equipmentId)] || "";
      return createNewAudit(user.userId, parseInt(equipmentId), statusId, note, auditTime);
    });

    await Promise.all(promises);

    res.status(200).json({ message: "Audit submitted successfully" });
  } catch (error) {
    console.error("Error submitting audit:", error);
    res.status(500).json({ error: "Failed to submit audit" });
  }
} 