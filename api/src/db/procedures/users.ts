import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { User, UserOverview } from "../../../../@types/data";

interface UserRow extends RowDataPacket, UserOverview {}
export async function getAllUsers() {
  try {
    const query = `SELECT 
                    p.PersonID,
                    WNumber, 
                    CONCAT(FirstName, " ", LastName) as Name, 
                    GROUP_CONCAT(DISTINCT d.Abbreviation SEPARATOR ', ') as Departments, 
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
    const [rows] = await pool.query<UserRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllUsers`, error);
    throw new Error("An error occurred while getting users");
  }
}

interface UserDetailsRow extends RowDataPacket, User {}
export async function getUserDetails(personID: number): Promise<User | undefined> {
  try {
    const query = `
      SELECT 
        WNumber, 
        CONCAT(FirstName, " ", LastName) as Name, 
        FirstName,
        LastName, 
        l.Barcode as Location,
        l.LocationID,
        l.BuildingID,
        l.RoomNumber,
        GROUP_CONCAT(d.Abbreviation SEPARATOR ', ') as Departments,
        JSON_ARRAYAGG(d.DepartmentID) as DepartmentID,
        JSON_ARRAYAGG(up.PermissionID) as Permissions
      FROM person p 
      JOIN user u on u.PersonID = p.PersonID
      JOIN userpermission up on up.UserID = u.UserID
      JOIN persondepartment pd on pd.PersonID = p.PersonID 
      JOIN department d on d.DepartmentID = pd.DepartmentID
      JOIN location l on l.LocationID = p.LocationID 
      WHERE p.PersonID = ?
      GROUP BY p.PersonID
                  `;
    const [rows] = await pool.query<UserDetailsRow[]>(query, [personID]);
    const user: UserDetailsRow | undefined = rows[0];
    return user;
  } catch (error) {
    console.error(`Error in getUserDetails`, error);
    throw new Error("An error occurred while getting user details");
  }
}

export async function dbUpdateUser(
  personID: number,
  updates: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  try {
    const setClauses: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`\`${key}\` = ?`);
      values.push(value);
    }

    //TODO: Update for User info
    const query = `
      update Equipment
      set ${setClauses.join(", ")}
      where EquipmentID = ?
    `;

    values.push(personID);

    await pool.query(query, values);
  } catch (error) {
    console.error(`Error in updateUser`, error);
    throw new Error("An error occurred while updating user");
  }
}