import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { ContactOverview } from "../../../../@types/data";

interface ContactRow extends RowDataPacket, ContactOverview {}

export async function getAllContacts() {
  try {
    const query = `SELECT 
                    p.PersonID,
                    WNumber, 
                    CONCAT(FirstName, " ", LastName) as Name, 
                    GROUP_CONCAT(d.Abbreviation SEPARATOR ', ') as Department, 
                    l.Barcode as Location,
                    MIN(d.DepartmentID) as DepartmentID
                  FROM person p 
                  JOIN persondepartment pd on pd.PersonID = p.PersonID 
                  JOIN department d on d.DepartmentID = pd.DepartmentID
                  JOIN location l on l.LocationID = p.LocationID 
                  GROUP BY p.PersonID`;
    const [rows] = await pool.query<ContactRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllContacts`, error);
    throw new Error("An error occurred while getting contacts");
  }
}
