import { JSONSchemaType } from "ajv";
import type { AssetClass } from "../../../@types/data";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchAssetClasses() {
  const response = await get("/asset-classes/list", validateResponse);
  if (response.status === "success") return response.data;
  return undefined;
}

const validateResponseSchema: JSONSchemaType<AssetClass[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      AssetClassID: { type: "number" },
      Name: { type: "string" },
      Abbreviation: { type: "string" }
    },
    required: ["Name", "AssetClassID", "Abbreviation"]
  }
};

const validateResponse = ajv.compile(validateResponseSchema);
