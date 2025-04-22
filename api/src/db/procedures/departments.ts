import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Department } from "../../../../@types/data";

interface DepartmentRow extends RowDataPacket, Department {}

export async function getAllDepartments() {
  try {
    const query = `SELECT DepartmentID, Name, Abbreviation FROM Department`;
    const [rows] = await pool.query<DepartmentRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllDepartments`, error);
    throw new Error("Failed to fetch departments");
  }
}

export async function addDepartment(department: Omit<Department, "DepartmentID">) {
  try {
    const query = `INSERT INTO Department (Name, Abbreviation) VALUES (?, ?)`;
    const [result] = await pool.query<ResultSetHeader>(query, [
      department.Name,
      department.Abbreviation,
    ]);
    return result.insertId;
  } catch (error) {
    console.error(`Error in addDepartment`, error);
    throw new Error("Failed to add department");
  }
}

export async function updateDepartment(department: Department) {
  try {
    const query = `UPDATE Department SET Name = ?, Abbreviation = ? WHERE DepartmentID = ?`;
    await pool.query(query, [department.Name, department.Abbreviation, department.DepartmentID]);
  } catch (error) {
    console.error(`Error in updateDepartment`, error);
    throw new Error("Failed to update department");
  }
}

export async function deleteDepartment(id: number) {
  try {
    const query = `DELETE FROM Department WHERE DepartmentID = ?`;
    await pool.query(query, [id]);
  } catch (error) {
    console.error(`Error in deleteDepartment`, error);
    throw new Error("Failed to delete department");
  }
}
