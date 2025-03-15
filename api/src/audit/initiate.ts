import type { Request, Response } from "express";
import { createNewAudit, getEquipmentByLocation, validateRoomBarcode } from "../db/procedures/audits";

interface RequestUser {
  UserID: number;
}

interface AuditRequestBody {
  roomBarcode: string;
}

export async function initiateAudit(req: Request<unknown, unknown, AuditRequestBody>, res: Response) {
  try {
    const { roomBarcode } = req.body;
    const user = res.locals.user as RequestUser;
    const userId = user.UserID;

    // Validate room barcode
    const room = await validateRoomBarcode(roomBarcode);
    if (!room) {
      res.status(404).json({ 
        status: "error", 
        error: { message: "Invalid room barcode" } 
      });
      return;
    }

    // Get equipment in the room (but don't fail if empty)
    const equipment = await getEquipmentByLocation(room.LocationID);
    console.log(`Found ${equipment.length} items in room ${roomBarcode}`);

    // Create audit records for existing equipment (if any)
    const auditResults = equipment.length > 0 
      ? await Promise.all(
          equipment.map(item => createNewAudit(userId, item.EquipmentID))
        )
      : [];
    
    res.json({ 
      status: "success", 
      data: { 
        roomNumber: room.RoomNumber,
        locationId: room.LocationID,
        equipmentCount: equipment.length,
        auditIds: auditResults.map(result => result.insertId),
        isEmptyRoom: equipment.length === 0
      } 
    });
  } catch (error) {
    console.error("Error in initiateAudit endpoint:", error);
    res.status(500).json({ 
      status: "error", 
      error: { message: "Failed to initiate audit" } 
    });
  }
}