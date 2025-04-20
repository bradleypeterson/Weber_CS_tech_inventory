import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { DeviceType } from "../../../../@types/data";

interface DeviceTypeRow extends RowDataPacket, DeviceType {}

export async function getAllDeviceTypes() {
  try {
    const query = `SELECT DeviceTypeID, Name, Abbreviation FROM DeviceType`;
    const [rows] = await pool.query<DeviceTypeRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllDeviceTypes`, error);
    throw new Error("Failed to fetch device types");
  }
}

export async function addDeviceType(deviceType: Omit<DeviceType, "DeviceTypeID">) {
  try {
    const query = `INSERT INTO DeviceType (Name, Abbreviation) VALUES (?, ?)`;
    const [result] = await pool.query(query, [deviceType.Name, deviceType.Abbreviation]);
    return (result as any).insertId;
  } catch (error) {
    console.error(`Error in addDeviceType`, error);
    throw new Error("Failed to add device type");
  }
}

export async function updateDeviceType(deviceType: DeviceType) {
  try {
    const query = `UPDATE DeviceType SET Name = ?, Abbreviation = ? WHERE DeviceTypeID = ?`;
    await pool.query(query, [deviceType.Name, deviceType.Abbreviation, deviceType.DeviceTypeID]);
  } catch (error) {
    console.error(`Error in updateDeviceType`, error);
    throw new Error("Failed to update device type");
  }
}

export async function deleteDeviceType(id: number) {
  try {
    const query = `DELETE FROM DeviceType WHERE DeviceTypeID = ?`;
    await pool.query(query, [id]);
  } catch (error) {
    console.error(`Error in deleteDeviceType`, error);
    throw new Error("Failed to delete device type");
  }
}