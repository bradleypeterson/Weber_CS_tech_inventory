import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "..";

interface RoomRow extends RowDataPacket {
  LocationID: number;
  BuildingID: number;
  RoomNumber: string;
  Barcode: string;
}

export async function validateRoomBarcode(barcode: string): Promise<RoomRow | null> {
  try {
    console.log('Validating barcode:', barcode);
    const query = `
      SELECT LocationID, BuildingID, RoomNumber, Barcode 
      FROM Location 
      WHERE Barcode = ?
      LIMIT 1
    `;
    const [rows] = await pool.query<RoomRow[]>(query, [barcode]);
    console.log('Query result:', rows);
    return rows[0] || null;
  } catch (error) {
    console.error(`Error in validateRoomBarcode:`, error);
    throw new Error("Failed to validate room barcode");
  }
}

interface EquipmentDetailsRow extends RowDataPacket {
  EquipmentID: number;
  TagNumber: string;
  SerialNumber: string;
  Description: string;
  DepartmentID: number;
  DepartmentName: string;
  LocationID: number;
  RoomNumber: string;
  BuildingID: number;
  BuildingName: string;
  BuildingAbbr: string;
  DeviceTypeName: string;
}

export async function getEquipmentByLocation(locationId: number): Promise<EquipmentDetailsRow[]> {
  try {
    const query = `
      SELECT 
        e.EquipmentID,
        e.TagNumber,
        e.SerialNumber,
        e.Description,
        d.DepartmentID,
        d.Name as DepartmentName,
        l.LocationID,
        l.RoomNumber,
        b.BuildingID,
        b.Name as BuildingName,
        b.Abbreviation as BuildingAbbr,
        dt.Name as DeviceTypeName
      FROM Equipment e
      LEFT JOIN Department d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN Location l ON e.LocationID = l.LocationID
      LEFT JOIN Building b on l.BuildingID = b.BuildingID 
      LEFT JOIN DeviceType dt ON e.DeviceTypeID = dt.DeviceTypeID
      WHERE e.LocationID = ? AND e.ArchiveStatus = 0
    `;
    const [rows] = await pool.query<EquipmentDetailsRow[]>(query, [locationId]);
    return rows;
  } catch (error) {
    console.error(`Error in getEquipmentByLocation:`, error);
    throw new Error("Failed to get equipment for location");
  }
}

export async function createNewAudit(createdBy: number, equipmentId: number): Promise<ResultSetHeader> {
  try {
    const query = `
      INSERT INTO Audit (
        CreatedBy, 
        EquipmentID, 
        AuditTime,
        AuditNote,
        AuditStatusID
      ) VALUES (
        ?, 
        ?,
        NOW(),
        'Initial room audit',
        1
      )
    `;
    const [result] = await pool.query<ResultSetHeader>(query, [createdBy, equipmentId]);
    return result;
  } catch (error) {
    console.error(`Error in createNewAudit:`, error);
    throw new Error("Failed to create new audit");
  }
}

export async function getEquipmentByTagNumber(tagNumber: string): Promise<EquipmentDetailsRow | null> {
  try {
    const query = `
      SELECT 
        e.EquipmentID,
        e.TagNumber,
        e.SerialNumber,
        e.Description,
        d.DepartmentID,
        d.Name as DepartmentName,
        l.LocationID,
        l.RoomNumber,
        b.BuildingID,
        b.Name as BuildingName,
        b.Abbreviation as BuildingAbbr,
        dt.Name as DeviceTypeName
      FROM Equipment e
      LEFT JOIN Department d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN Location l ON e.LocationID = l.LocationID
      LEFT JOIN Building b on l.BuildingID = b.BuildingID 
      LEFT JOIN DeviceType dt ON e.DeviceTypeID = dt.DeviceTypeID
      WHERE e.TagNumber = ? AND e.ArchiveStatus = 0
      LIMIT 1
    `;
    const [rows] = await pool.query<EquipmentDetailsRow[]>(query, [tagNumber]);
    return rows[0] || null;
  } catch (error) {
    console.error(`Error in getEquipmentByTagNumber:`, error);
    throw new Error("Failed to get equipment by tag number");
  }
} 