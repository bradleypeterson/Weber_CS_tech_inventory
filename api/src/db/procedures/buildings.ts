import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Building } from "../../../../@types/data";

interface BuildingRow extends RowDataPacket, Building {}

export async function getAllBuildings() {
  try {
    const query = `select BuildingID, Name, Abbreviation from Building`;
    const [rows] = await pool.query<BuildingRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllBuildings`, error);
    throw new Error("An error occurred while getting buildings from database");
  }
} 