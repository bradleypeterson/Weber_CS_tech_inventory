import { JSONSchemaType } from "ajv";
import type { Department } from "../../../@types/data";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchDepartments() {
  const response = await get("/departments/list", validateResponse);
  if (response.status === "success") return response.data;
  return undefined;
}

const validateResponseSchema: JSONSchemaType<Department[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      DepartmentID: { type: "number" },
      Name: { type: "string" },
      Abbreviation: { type: "string" }
    },
    required: ["Name", "DepartmentID", "Abbreviation"]
  }
};

const validateResponse = ajv.compile(validateResponseSchema);
