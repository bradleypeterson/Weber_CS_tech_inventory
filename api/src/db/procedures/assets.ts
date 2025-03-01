import type { RowDataPacket } from "mysql2";
import { pool } from "..";

interface AssetRow extends RowDataPacket {
  EquipmentID: number;
  TagNumber: string;
  DepartmentID: number;
  AssetClassID: number;
}

export async function getAllAssets() {
  try {
    const query = `select EquipmentID, TagNumber, AssetClassID, DepartmentID from Equipment`;
    const [rows] = await pool.query<AssetRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllAssets`, error);
    throw new Error("An error occurred while getting assets");
  }
}
