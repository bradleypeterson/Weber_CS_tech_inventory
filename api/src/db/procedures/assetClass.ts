import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { AssetClass } from "../../../../@types/data";

interface AssetClassRow extends RowDataPacket, AssetClass {}

export async function getAllAssetClasses() {
  try {
    const query = `select AssetClassID, Name, Abbreviation from AssetClass`;
    const [rows] = await pool.query<AssetClassRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllAssetClasses`, error);
    throw new Error("An error occurred while getting asset classes from database");
  }
}
