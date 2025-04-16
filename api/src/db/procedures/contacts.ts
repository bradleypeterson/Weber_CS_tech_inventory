import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Contact, ContactOverview } from "../../../../@types/data";

interface ContactRow extends RowDataPacket, ContactOverview {}
export async function getAllContacts() {
  try {
    const query = `SELECT 
                    p.PersonID,
                    WNumber, 
                    CONCAT(FirstName, " ", LastName) as FullName, 
                    GROUP_CONCAT(DISTINCT d.Abbreviation SEPARATOR ', ') as Departments, 
                    l.Barcode as Location,
                    JSON_ARRAYAGG(d.DepartmentID) as DepartmentID
                  FROM Person p 
                  JOIN PersonDepartment pd on pd.PersonID = p.PersonID 
                  JOIN Department d on d.DepartmentID = pd.DepartmentID
                  JOIN Location l on l.LocationID = p.LocationID 
                  GROUP BY p.PersonID`;
    const [rows] = await pool.query<ContactRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllContacts`, error);
    throw new Error("An error occurred while getting contacts");
  }
}

interface ContactDetailsRow extends RowDataPacket, Contact {}
export async function getContactDetails(personID: number): Promise<ContactDetailsRow | undefined> {
  try {
    const query = `
      SELECT 
        WNumber, 
        CONCAT(FirstName, " ", LastName) as FullName, 
        FirstName,
        LastName,
        l.LocationID,
        l.BuildingID,
        GROUP_CONCAT(d.Abbreviation SEPARATOR ', ') as Departments,
        JSON_ARRAYAGG(d.DepartmentID) as DepartmentID
      FROM Person p 
      JOIN PersonDepartment pd on pd.PersonID = p.PersonID 
      JOIN Department d on d.DepartmentID = pd.DepartmentID
      JOIN Location l on l.LocationID = p.LocationID 
      WHERE p.PersonID = ?
      GROUP BY p.PersonID, WNumber, FullName, FirstName, LastName, LocationID, BuildingID
                  `;
    const [rows] = await pool.query<ContactDetailsRow[]>(query, [personID.toString()]);
    const contact: ContactDetailsRow | undefined = rows[0];
    return contact;
  } catch (error) {
    console.error(`Error in getContactDetails`, error);
    throw new Error("An error occurred while getting contact details");
  }
}

export async function dbUpdateContact(
  personID: string, WNumber: string, FirstName: string, LastName:string,
  DepartmentID: number[], BuildingID: number, LocationID: number
  ) {

  try {
    const query = `
      UPDATE Person
        SET FirstName = ?, 
          LastName = ?,
          WNumber = ?,
          LocationID = ?
        WHERE PersonID = ?;
    `;
    await pool.query(query, [FirstName, LastName, WNumber, LocationID, personID]);

    const deptQuery = `
      INSERT IGNORE INTO PersonDepartment(PersonID, DepartmentID)
        VALUES(?, ?);
    `;    
    for (const element of DepartmentID) {
      await pool.query(deptQuery, [personID, element]);
    }

    const departmentRemoveQuery = `
        DELETE FROM PersonDepartment
          WHERE PersonID = ? AND DepartmentID NOT IN (?);
      `;
      // Execute the query with userID and the permissions array
    await pool.query(departmentRemoveQuery, [personID, DepartmentID]);
      
  } catch (error) {
    console.log("Error in procedure");
    console.error(`Error in updateContact`, error);
    throw new Error("Database query failed while updating contact");
  }
}

interface PersonRow extends RowDataPacket {
  PersonID: number;
}

export async function dbAddContact(
  WNumber: string, FirstName: string, LastName:string,
  DepartmentID: number[], BuildingID: number, LocationID: number
  ) {

  try {
    const query = `
      INSERT INTO Person(FirstName, LastName, WNumber, LocationID)
        VALUES (?,?,?,?);
    `;

    const idQuery = `SELECT PersonID from Person WHERE WNumber = ?;`;

    const deptQuery = `
      INSERT IGNORE INTO PersonDepartment(PersonID, DepartmentID)
        VALUES(?, ?);
    `;

    await pool.query(query, [FirstName, LastName, WNumber, LocationID]);

    //get personID
    const [rows] = await pool.query<PersonRow[]>(idQuery, [WNumber]);
    if (rows.length === 0) {
      throw new Error("PersonID not found after insertion");
    }
    const personID = rows[0].PersonID;

    for (const element of DepartmentID) {
      await pool.query(deptQuery, [personID, element]);
    }
      
  } catch (error) {
    console.log("Error in procedure");
    console.error(`Error in addContact`, error);
    throw new Error("Database query failed while adding contact");
  }
}
