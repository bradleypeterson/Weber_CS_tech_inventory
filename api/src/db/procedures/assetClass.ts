import type { ResultSetHeader, RowDataPacket } from "mysql2";
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

export async function addAssetClass(assetClass: Omit<AssetClass, "AssetClassID">) {
  try {
    const query = `INSERT INTO AssetClass (Name, Abbreviation) VALUES (?, ?)`;
    const [result] = await pool.query<ResultSetHeader>(query, [
      assetClass.Name,
      assetClass.Abbreviation,
    ]);
    return result.insertId;
  } catch (error) {
    console.error(`Error in addAssetClass`, error);
    throw new Error("Failed to add asset class");
  }
}

export async function updateAssetClass(assetClass: AssetClass) {
  try {
    const query = `UPDATE AssetClass SET Name = ?, Abbreviation = ? WHERE AssetClassID = ?`;
    await pool.query(query, [assetClass.Name, assetClass.Abbreviation, assetClass.AssetClassID]);
  } catch (error) {
    console.error(`Error in updateAssetClass`, error);
    throw new Error("Failed to update asset class");
  }
}

export async function deleteAssetClass(id: number) {
  try {
    const query = `DELETE FROM AssetClass WHERE AssetClassID = ?`;
    await pool.query(query, [id]);
  } catch (error) {
    console.error(`Error in deleteAssetClass`, error);
    throw new Error("Failed to delete asset class");
  }
}
