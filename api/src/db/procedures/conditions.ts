import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Condition } from "../../../../@types/data";

interface ConditionRow extends RowDataPacket, Condition { }
export async function getAllConditions() {
  try {
    const query = `
      select ConditionID, ConditionName, ConditionAbbreviation
      from \`Condition\`
    `;

    const [rows] = await pool.query<ConditionRow[]>(query);

    return rows;
  } catch (error) {
    console.error(`Error in getAllConditions`, error);
    throw new Error("An error occurred while getting conditions.");
  }
}

export async function addCondition(condition: Omit<Condition, "ConditionID">) {
  try {
    const query = `INSERT INTO \`Condition\` (ConditionName, ConditionAbbreviation) VALUES (?, ?)`;
    const [result] = await pool.query<ResultSetHeader>(query, [
      condition.ConditionName,
      condition.ConditionAbbreviation,
    ]);
    return result.insertId; // TypeScript now knows `insertId` exists on `OkPacket`
  } catch (error) {
    console.error(`Error in addCondition`, error);
    throw new Error("Failed to add condition");
  }
}

export async function updateCondition(condition: Condition) {
  try {
    const query = `UPDATE \`Condition\` SET ConditionName = ?, ConditionAbbreviation = ? WHERE ConditionID = ?`;
    await pool.query(query, [
      condition.ConditionName,
      condition.ConditionAbbreviation,
      condition.ConditionID
    ]);
  } catch (error) {
    console.error(`Error in updateCondition`, error);
    throw new Error("Failed to update condition");
  }
}

export async function deleteCondition(id: number) {
  try {
    const query = `DELETE FROM \`Condition\` WHERE ConditionID = ?`;
    await pool.query(query, [id]);
  } catch (error) {
    console.error(`Error in deleteCondition`, error);
    throw new Error("Failed to delete condition");
  }
}
