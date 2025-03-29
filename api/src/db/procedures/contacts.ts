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
        l.Barcode as Location,
        l.BuildingID,
        l.RoomNumber, 
        GROUP_CONCAT(d.Abbreviation SEPARATOR ', ') as Departments,
        JSON_ARRAYAGG(d.DepartmentID) as DepartmentID
      FROM person p 
      JOIN persondepartment pd on pd.PersonID = p.PersonID 
      JOIN department d on d.DepartmentID = pd.DepartmentID
      JOIN location l on l.LocationID = p.LocationID 
      WHERE p.PersonID = ?
      GROUP BY p.PersonID, WNumber, FullName, FirstName, LastName, Location, BuildingID, RoomNumber
                  `;
    const [rows] = await pool.query<ContactDetailsRow[]>(query, [personID.toString()]);
    const contact: ContactDetailsRow | undefined = rows[0];
    console.log(rows);
    return contact;
  } catch (error) {
    console.error(`Error in getContactDetails`, error);
    throw new Error("An error occurred while getting contact details");
  }
}

export async function dbUpdateContact(
  personID: string, WNumber: string, FirstName: string, LastName:string,
  DepartmentID: number[], BuildingID: number, RoomNumber: string
  ) {

  try {
    const query = `
      UPDATE person
        SET FirstName = ?, 
          LastName = ?,
          WNumber = ?,
          LocationID = (SELECT LocationID FROM location WHERE BuildingID = ? AND RoomNumber = ?)
        WHERE PersonID = ?;
    `;

    const deptQuery = `
      INSERT IGNORE INTO persondepartment(PersonID, DepartmentID)
        VALUES(?, ?);
    `;

    await pool.query(query, [FirstName, LastName, WNumber, BuildingID, RoomNumber, personID]);

    for (const element of DepartmentID) {
      await pool.query(deptQuery, [personID, element]);
    }
      
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
  DepartmentID: number[], BuildingID: number, RoomNumber: string
  ) {

  try {
    const query = `
      INSERT INTO person(FirstName, LastName, WNumber, LocationID)
        VALUES (?,?,?,(SELECT LocationID FROM location WHERE BuildingID = ? AND RoomNumber = ?));
    `;

    const idQuery = `SELECT PersonID from person WHERE WNumber = ?;`;

    const deptQuery = `
      INSERT IGNORE INTO persondepartment(PersonID, DepartmentID)
        VALUES(?, ?);
    `;

    await pool.query(query, [FirstName, LastName, WNumber, BuildingID, RoomNumber]);

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
