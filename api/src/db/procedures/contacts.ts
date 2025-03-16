import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Contact, ContactOverview } from "../../../../@types/data";

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

interface ContactDetailsRow extends RowDataPacket, Contact {}
export async function getContactDetails(personID: number): Promise<ContactDetailsRow | undefined> {
  try {
    const query = `
      SELECT 
        WNumber, 
        CONCAT(FirstName, " ", LastName) as Name, 
        FirstName,
        LastName, 
        l.Barcode as Location,
        GROUP_CONCAT(d.Abbreviation SEPARATOR ', ') as Department
      FROM person p 
      JOIN user u on u.PersonID = p.PersonID
      JOIN userpermission up on up.UserID = u.UserID
      JOIN persondepartment pd on pd.PersonID = p.PersonID 
      JOIN department d on d.DepartmentID = pd.DepartmentID
      JOIN location l on l.LocationID = p.LocationID 
      WHERE p.PersonID = ?
      GROUP BY p.PersonID
                  `;
    const [rows] = await pool.query<ContactDetailsRow[]>(query, [personID]);
    const contact: ContactDetailsRow | undefined = rows[0];
    return contact;
  } catch (error) {
    console.error(`Error in getContactDetails`, error);
    throw new Error("An error occurred while getting contact details");
  }
}

export async function dbUpdateContact(
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

    //TODO: Update for Contact info
    const query = `
      update Person
      set FirstName = John
      where PersonID = ?
    `;

    
    //   update Person
    //   set ${setClauses.join(", ")}
    //   where PersonID = ?
    

    values.push(personID);

    await pool.query(query, values);
  } catch (error) {
    console.error(`Error in updateContact`, error);
    throw new Error("An error occurred while updating contact");
  }
}