import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../db";

interface AuditHistoryRow extends RowDataPacket {
  auditId: number;
  date: string;
  building: string;
  room: string;
  auditor: string;
  itemsMissing: boolean;
}

interface AuditDetailRow extends RowDataPacket {
  tag_number: string;
  department: string;
  asset_class: string;
  device_type: string;
  contact_person: string;
  status: string;
}

export async function getAuditHistory(req: Request, res: Response) {
  try {
    const query = `
      SELECT DISTINCT
        a.AuditID as auditId,
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

    const formattedData = rows.map(row => ({
      auditId: row.auditId,
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

export async function getAuditDetails(req: Request, res: Response) {
  try {
    const auditId = Number(req.params.id);
    
    if (isNaN(auditId)) {
      return res.status(400).json({
        status: "error",
        error: { message: "Invalid audit ID" }
      });
    }

    const query = `
      SELECT 
        e.TagNumber as tag_number,
        d.Name as department,
        ac.Name as asset_class,
        dt.Name as device_type,
        CONCAT(p.FirstName, ' ', p.LastName) as contact_person,
        ast.StatusName as status,
        a.AuditTime as audit_time,
        b.Abbreviation as building,
        l.RoomNumber as room,
        CONCAT(u.FirstName, ' ', u.LastName) as created_by
      FROM AuditDetails ad
      JOIN Equipment e ON ad.EquipmentID = e.EquipmentID
      JOIN Audit a ON ad.AuditID = a.AuditID
      JOIN Location l ON a.LocationID = l.LocationID
      JOIN Building b ON l.BuildingID = b.BuildingID
      JOIN Person u ON a.CreatedBy = u.PersonID
      LEFT JOIN Department d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN AssetClass ac ON e.AssetClassID = ac.AssetClassID
      LEFT JOIN DeviceType dt ON e.DeviceTypeID = dt.DeviceTypeID
      LEFT JOIN Person p ON e.ContactPersonID = p.PersonID
      LEFT JOIN AuditStatus ast ON ad.AuditStatusID = ast.AuditStatusID
      WHERE ad.AuditID = ?
    `;

    const [rows] = await pool.query<AuditDetailRow[]>(query, [auditId]);

    res.json({ 
      status: "success", 
      data: rows 
    });
  } catch (error) {
    console.error("Error in getAuditDetails:", error);
    res.status(500).json({ 
      status: "error", 
      error: { message: "Failed to get audit details" } 
    });
  }
}

export async function getAuditNotes(req: Request, res: Response) {
  try {
    const auditId = Number(req.params.id);
    
    if (isNaN(auditId)) {
      return res.status(400).json({
        status: "error",
        error: { message: "Invalid audit ID" }
      });
    }

    const query = `
      SELECT 
        e.TagNumber as tagNumber,
        ad.AuditNote as note
      FROM AuditDetails ad
      JOIN Equipment e ON ad.EquipmentID = e.EquipmentID
      WHERE ad.AuditID = ? AND ad.AuditNote IS NOT NULL AND ad.AuditNote <> ''
    `;

    const [rows] = await pool.query(query, [auditId]);

    res.json({ 
      status: "success", 
      data: rows 
    });
  } catch (error) {
    console.error("Error in getAuditNotes:", error);
    res.status(500).json({ 
      status: "error", 
      error: { message: "Failed to get audit notes" } 
    });
  }
} 