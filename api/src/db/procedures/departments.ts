import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Department } from "../../../../@types/data";

interface DepartmentRow extends RowDataPacket, Department {}

export async function getAllDepartments() {
  try {
    const query = `select DepartmentID, Name, Abbreviation from Department`;
    const [rows] = await pool.query<DepartmentRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllDepartments`, error);
    throw new Error("An error occurred while getting departments from database");
  }
}
