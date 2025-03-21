import type { RowDataPacket } from "mysql2";
import { pool } from "..";

interface SaltRow extends RowDataPacket {
  Salt: string;
}

export async function getUserSalt(userId: string) {
  try {
    const query = `select Salt from User where UserID = ?`;
    const [rows] = await pool.query<SaltRow[]>(query, [userId]);
    if (rows.length === 0) return null;
    return rows[0].Salt;
  } catch (error) {
    console.error(`Database error in getSaltByUsername: `, error);
    throw new Error("Database query failed");
  }
}

interface UserDetailsRow extends RowDataPacket {
  UserID: number;
  PersonID: number;
  HashedPassword?: string;
  Salt: string;
  Permissions: number[];
}

export async function getUserDetails(userId: string) {
  try {
    const query = `
      select 
        u.UserID as UserID,
        PersonID, HashedPassword,
        Salt,
        if(
          count(up.PermissionId) > 0, 
          JSON_ARRAYAGG(up.PermissionId), 
          JSON_ARRAY()
        ) AS Permissions
      from User u
      left join UserPermission up on u.UserID = up.UserID 
      where u.UserID = ?
      group by userID, PersonID, HashedPassword, Salt
      limit 1
    `;

    const [rows] = await pool.query<UserDetailsRow[]>(query, [userId]);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error(`Database error in getUserDetails: `, error);
    throw new Error("Database query failed");
  }
}
