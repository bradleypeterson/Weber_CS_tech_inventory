import type { RowDataPacket } from "mysql2";
import { pool } from "..";
import type { Room } from "../../../../@types/data";

interface RoomRow extends RowDataPacket, Room {}

export async function getAllRooms() {
  try {
    const query = `select LocationID, RoomNumber, BuildingID, Barcode from Location`;
    const [rows] = await pool.query<RoomRow[]>(query);
    return rows;
  } catch (error) {
    console.error(`Error in getAllRooms`, error);
    throw new Error("An error occurred while getting rooms from database");
  }
} 