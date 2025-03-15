import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { UserOverview } from "../../../../@types/data";

interface ContactRow extends RowDataPacket, UserOverview {}

export async function getAllUsers() {
  try {
    const query = `SELECT 
                    p.PersonID,
                    WNumber, 
                    CONCAT(FirstName, " ", LastName) as Name, 
                    GROUP_CONCAT(d.Abbreviation SEPARATOR ', ') as Department, 
                    l.Barcode as Location,
                    JSON_ARRAYAGG(d.DepartmentID) as DepartmentID,
                    JSON_ARRAYAGG(up.PermissionID) as Permissions
                  FROM person p 
                  JOIN user u on u.PersonID = p.PersonID
                  JOIN userpermission up on up.UserID = u.UserID
                  JOIN persondepartment pd on pd.PersonID = p.PersonID 
                  JOIN department d on d.DepartmentID = pd.DepartmentID
                  JOIN location l on l.LocationID = p.LocationID 
                  GROUP BY p.PersonID`;
    const [rows] = await pool.query<ContactRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllUsers`, error);
    throw new Error("An error occurred while getting users");
  }
}
