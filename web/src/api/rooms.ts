import { JSONSchemaType } from "ajv";
import type { Room } from "../../../@types/data";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchRooms() {
  const response = await get("/rooms/list", validateResponse);
  if (response.status === "success") return response.data;
  return undefined;
}

const validateResponseSchema: JSONSchemaType<Room[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      LocationID: { type: "number" },
      RoomNumber: { type: "string" },
      BuildingID: { type: "number" },
      Barcode: { type: "string" }
    },
    required: ["LocationID", "RoomNumber", "BuildingID", "Barcode"]
  }
};

const validateResponse = ajv.compile(validateResponseSchema);