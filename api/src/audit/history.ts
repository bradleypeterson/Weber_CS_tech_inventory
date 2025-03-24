import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../db";

interface AuditHistoryRow extends RowDataPacket {
  date: string;
  building: string;
  room: string;
  auditor: string;
  itemsMissing: boolean;
}

export async function getAuditHistory(req: Request, res: Response) {
  try {
    const query = `
      SELECT DISTINCT
        a.AuditID,
        DATE_FORMAT(a.AuditTime, '%c/%e/%Y') as date,
        b.Name as building,
        l.RoomNumber as room,
        CONCAT(p.FirstName, ' ', p.LastName) as auditor,
        EXISTS (
          SELECT 1 
          FROM AuditDetails ad2 
          WHERE ad2.AuditID = a.AuditID 
          AND ad2.AuditStatusID = 3
        ) as itemsMissing
      FROM Audit a
      JOIN Location l ON a.LocationID = l.LocationID
      JOIN Building b ON l.BuildingID = b.BuildingID
      JOIN User u ON a.CreatedBy = u.UserID
      JOIN Person p ON u.PersonID = p.PersonID
      LEFT JOIN AuditDetails ad ON a.AuditID = ad.AuditID
      GROUP BY a.AuditID, date, building, room, auditor
      ORDER BY a.AuditTime DESC
      LIMIT 100
    `;

    const [rows] = await pool.query<AuditHistoryRow[]>(query);

    // Ensure the response matches the expected format
    const formattedData = rows.map(row => ({
      date: row.date,
      building: row.building,
      room: row.room,
      auditor: row.auditor,
      itemsMissing: Boolean(row.itemsMissing)
    }));

    res.json({ 
      status: "success", 
      data: formattedData 
    });
  } catch (error) {
    console.error("Error in getAuditHistory:", error);
    res.status(500).json({ 
      status: "error", 
      error: { message: "Failed to get audit history" } 
    });
  }
} 