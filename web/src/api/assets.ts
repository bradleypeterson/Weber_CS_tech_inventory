import { JSONSchemaType } from "ajv";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchAssetsList() {
  const response = await get("/assets/list", validateResponse);
  if (response.status === "success") return response.data;
  return undefined;
}

const validateResponseSchema: JSONSchemaType<
  { EquipmentID: number; TagNumber: string; DepartmentID: number; AssetClassID: number }[]
> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      EquipmentID: { type: "number" },
      DepartmentID: { type: "number" },
      AssetClassID: { type: "number" },
      TagNumber: { type: "string" }
    },
    required: ["EquipmentID", "TagNumber", "AssetClassID", "DepartmentID"]
  }
};

const validateResponse = ajv.compile(validateResponseSchema);
