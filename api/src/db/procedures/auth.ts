import type { RowDataPacket } from "mysql2";
import { pool } from "..";

interface UserRow extends RowDataPacket {
  Salt: string;
}

export async function getUserSalt(userId: string) {
  try {
    const query = `select Salt from User where UserID = ?`;
    const [rows] = await pool.query<UserRow[]>(query, [userId]);
    if (rows.length === 0) return null;
    return rows[0].Salt;
  } catch (error) {
    console.error(`Database error in getSaltByUsername: `, error);
    throw new Error("Database query failed");
  }
}
