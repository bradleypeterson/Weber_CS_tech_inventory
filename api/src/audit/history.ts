import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../db";

interface AuditHistoryRow extends RowDataPacket {
  AuditTime: Date;
  BuildingName: string;
  RoomNumber: string;
  AuditorName: string;
  ItemsMissing: boolean;
}

export async function getAuditHistory(req: Request, res: Response) {
  try {
    const query = `
      SELECT DISTINCT
        a.AuditTime as AuditDate,
        b.Name as BuildingName,
        l.RoomNumber,
        CONCAT(p.FirstName, ' ', p.LastName) as AuditorName,
        EXISTS (
          SELECT 1 
          FROM Audit a2 
          WHERE a2.AuditTime = a.AuditTime
          AND a2.CreatedBy = a.CreatedBy
          AND a2.AuditStatusID = 3
        ) as ItemsMissing
      FROM Audit a
      JOIN Equipment e ON a.EquipmentID = e.EquipmentID
      JOIN Location l ON e.LocationID = l.LocationID
      JOIN Building b ON l.BuildingID = b.BuildingID
      JOIN User u ON a.CreatedBy = u.UserID
      JOIN Person p ON u.PersonID = p.PersonID
      GROUP BY a.AuditTime, a.CreatedBy, l.LocationID
      ORDER BY a.AuditTime DESC
      LIMIT 100
    `;

    const [rows] = await pool.query<AuditHistoryRow[]>(query);

    res.json({
      status: "success",
      data: rows.map(row => {
        const date = new Date(row.AuditDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return {
          date: `${year}-${month}-${day}`,
          building: row.BuildingName,
          room: row.RoomNumber,
          auditor: row.AuditorName,
          itemsMissing: Boolean(row.ItemsMissing)
        };
      })
    });
  } catch (error) {
    console.error("Error in getAuditHistory:", error);
    res.status(500).json({
      status: "error",
      error: { message: "Failed to fetch audit history" }
    });
  }
} 