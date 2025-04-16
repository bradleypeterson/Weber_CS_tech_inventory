import { JSONSchemaType } from "ajv";
import type { Building } from "../../../@types/data";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchBuildings() {
  const response = await get("/buildings/list", validateResponse);
  if (response.status === "success") return response.data;
  return undefined;
}

const validateResponseSchema: JSONSchemaType<Building[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      BuildingID: { type: "number" },
      Name: { type: "string" },
      Abbreviation: { type: "string" }
    },
    required: ["Name", "BuildingID", "Abbreviation"]
  }
};

const validateResponse = ajv.compile(validateResponseSchema);
