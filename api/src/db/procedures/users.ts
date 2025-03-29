import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { User, UserOverview } from "../../../../@types/data";
import { changePassword } from "./auth";

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
      u.UserID,   
      WNumber,
        CONCAT(FirstName, " ", LastName) as Name, 
        FirstName,
        LastName, 
        l.Barcode as Location,
        l.LocationID,
        l.BuildingID,
        b.Abbreviation as BuildingAbbreviation,
        b.Name as BuildingName,
        l.RoomNumber,
        GROUP_CONCAT(d.Abbreviation SEPARATOR ', ') as Departments,
        JSON_ARRAYAGG(d.DepartmentID) as DepartmentID,
        JSON_ARRAYAGG(up.PermissionID) as Permissions,
        (SELECT Count(PermissionID) from userpermission where PermissionID = 1 and UserID = ?) as Permission1,
        (SELECT Count(PermissionID) from userpermission where PermissionID = 2 and UserID = ?) as Permission2,
        (SELECT Count(PermissionID) from userpermission where PermissionID = 3 and UserID = ?) as Permission3,
        (SELECT Count(PermissionID) from userpermission where PermissionID = 4 and UserID = ?) as Permission4,
        (SELECT Count(PermissionID) from userpermission where PermissionID = 5 and UserID = ?) as Permission5,
        (SELECT Count(PermissionID) from userpermission where PermissionID = 6 and UserID = ?) as Permission6,
        (SELECT Count(PermissionID) from userpermission where PermissionID = 7 and UserID = ?) as Permission7
      FROM person p 
      JOIN user u on u.PersonID = p.PersonID
      JOIN userpermission up on up.UserID = u.UserID
      JOIN persondepartment pd on pd.PersonID = p.PersonID 
      JOIN department d on d.DepartmentID = pd.DepartmentID
      JOIN location l on l.LocationID = p.LocationID 
      JOIN building b on l.BuildingID = b.BuildingID
      WHERE p.PersonID = ?
      GROUP BY p.PersonID
                  `;
    const [rows] = await pool.query<UserDetailsRow[]>(query, [personID, personID, personID, personID, personID, personID, personID, personID]);
    const user: UserDetailsRow | undefined = rows[0];
    console.log(user.Permissions);
    return user;
  } catch (error) {
    console.error(`Error in getUserDetails`, error);
    throw new Error("An error occurred while getting user details");
  }
}

interface UserIDRow extends RowDataPacket {
  UserID: number;
}

export async function dbUpdateUser(
  personID: number,
  updates: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  try {
    const updateQuery = `
      UPDATE person
        SET FirstName = ?, 
          LastName = ?,
          WNumber = ?,
          LocationID = (SELECT LocationID FROM location WHERE BuildingID = ? AND RoomNumber = ?)
        WHERE PersonID = ?;
    `;
    await pool.query(updateQuery, [updates.FirstName, updates.LastName, updates.WNumber, updates.BuildingID, updates.RoomNumber, personID]);

    const deptQuery = `
      INSERT IGNORE INTO persondepartment(PersonID, DepartmentID)
        VALUES(?, ?);
    `;
    if (Array.isArray(updates.DepartmentID)) {
      for (const departmentID of updates.DepartmentID) {
        await pool.query(deptQuery, [personID, departmentID]);
        console.log("Department: ", departmentID);
      }
    }

    const userIdQuery = `
      SELECT UserID
        FROM user
        WHERE PersonID = ?;
    `;
    const [rows] = await pool.query<UserIDRow[]>(userIdQuery, [personID]);
        if (rows.length === 0) {
          throw new Error("UserID not found after insertion");
        }
        const userID = rows[0].UserID;

    const permissionsInsertQuery =`
      INSERT IGNORE INTO userpermission(UserID, PermissionID)
        VALUES (?, ?);
    `;
    if (Array.isArray(updates.Permissions)) {
      for (const permissionID of updates.Permissions) {
        await pool.query(permissionsInsertQuery, [userID, permissionID]);
        console.log("Permission; ", permissionID);
      }
    }
     
    if (Array.isArray(updates.Permissions) && updates.Permissions.length > 0) {
      const placeholders = updates.Permissions.map(() => '?').join(','); // Create placeholders for the array
      
      const permissionsRemoveQuery = `
        DELETE FROM userpermission
        WHERE UserID = ? AND PermissionID NOT IN (${placeholders});
      `;
      // Execute the query with userID and the permissions array
      await pool.query(permissionsRemoveQuery, [userID, ...updates.Permissions]);
      console.log("Revoked permissions removed for UserID:", userID);
    } else {
      // If no permissions are provided, delete all permissions for the user
      const permissionsRemoveQuery = `
        DELETE FROM userpermission
        WHERE UserID = ?;
      `;
      await pool.query(permissionsRemoveQuery, [userID]);
      console.log("All permissions removed for UserID:", userID);
    }

  } catch (error) {
    console.error(`Error in updateUser`, error);
    throw new Error("An error occurred while updating user");
  }
}

interface PersonRow extends RowDataPacket {
  PersonID: number;
}

export async function dbAddUser(
  details: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  try {
    const query = `
      INSERT INTO person(FirstName, LastName, WNumber, LocationID)
        VALUES (?,?,?,(SELECT LocationID FROM location WHERE BuildingID = ? AND RoomNumber = ?));
    `;
    await pool.query(query, [details.FirstName, details.LastName, details.WNumber, 
      details.BuildingID, details.RoomNumber]);
    
    //get personID
    const idQuery = `SELECT PersonID from person WHERE WNumber = ?;`;
    const [personRows] = await pool.query<PersonRow[]>(idQuery, [details.WNumber]);
    if (personRows.length === 0) {
      throw new Error("PersonID not found after insertion");
    }
    const personID = personRows[0].PersonID;

    const deptQuery = `
      INSERT IGNORE INTO persondepartment(PersonID, DepartmentID)
        VALUES(?, ?);
    `;
    if (Array.isArray(details.DepartmentID)) {
      for (const departmentID of details.DepartmentID) {
        await pool.query(deptQuery, [personID, departmentID]);
        console.log("Department: ", departmentID);
      }
    }

    const queryUser = `
    INSERT INTO user(PersonID, HashedPassword, Salt)
      VALUES (?,?,?);
    `;
    await pool.query(queryUser, [personID, details.hashedNewPassword, details.Salt]);
      
    const userIdQuery = `
      SELECT UserID
        FROM user
        WHERE PersonID = ?;
    `;
    const [rows] = await pool.query<UserIDRow[]>(userIdQuery, [personID]);
      if (rows.length === 0) {
        throw new Error("UserID not found after insertion");
      }
    const userID = rows[0].UserID;

    const permissionsInsertQuery =`
      INSERT IGNORE INTO userpermission(UserID, PermissionID)
        VALUES (?, ?);
    `;
    if (Array.isArray(details.Permissions)) {
      for (const permissionID of details.Permissions) {
        await pool.query(permissionsInsertQuery, [userID, permissionID]);
        console.log("Permission; ", permissionID);
      }
    }
  
    if (typeof details.Salt === "string" && typeof details.hashedNewPassword === "string") {
      await changePassword(userID.toString(), details.hashedNewPassword, details.Salt);
    } else {
      console.error("Invalid Salt value: must be a string");
      throw new Error("Invalid Salt value");
    }    

  } catch (error) {
    console.error(`Error in updateUser`, error);
    throw new Error("An error occurred while updating user");
  }
}