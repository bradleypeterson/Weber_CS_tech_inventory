import { JSONSchemaType } from "ajv";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchAssetsList() {
  const response = await get("/assets/list", validateResponse);
  console.log("rse", response);
  return response;
}

const validateResponseSchema: JSONSchemaType<{ EquipmentID: number; TagNumber: string }[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      EquipmentID: { type: "number" },
      TagNumber: { type: "string" }
    },
    required: ["EquipmentID", "TagNumber"]
  }
};

const validateResponse = ajv.compile(validateResponseSchema);
