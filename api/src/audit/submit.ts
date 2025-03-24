import type { Request, Response } from "express";
import { createNewAudit } from "../db/procedures/audits";

interface AuditSubmission {
  roomId: number;
  itemStatuses: Record<number, number>;
  notes: string[];
}

export async function submitAudit(req: Request, res: Response) {
  try {
    const { roomId, itemStatuses, notes } = req.body as AuditSubmission;
    const user = res.locals.user;

    if (!user?.UserID) {
      return res.status(401).json({ 
        status: "error",
        error: { message: "Unauthorized" }
      });
    }

    // Create a single timestamp for the entire audit session
    const auditTime = new Date();

    // Prepare all equipment items for the audit
    const equipmentItems = Object.entries(itemStatuses).map(([equipmentId, statusId]) => ({
      equipmentId: parseInt(equipmentId),
      statusId: Number(statusId),
      note: notes[Number(equipmentId)] || ""
    }));

    // Create a single audit session with all items
    await createNewAudit(
      user.UserID,
      roomId,
      equipmentItems,
      auditTime
    );

    res.status(200).json({ 
      status: "success",
      message: "Audit submitted successfully"
    });
  } catch (error) {
    console.error("Error submitting audit:", error);
    res.status(500).json({ 
      status: "error",
      error: { message: "Failed to submit audit" }
    });
  }
} 