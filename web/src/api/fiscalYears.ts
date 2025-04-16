import { fiscalYearArraySchema } from "../../../@types/schemas";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchFiscalYears() {
  const response = await get("/fiscal-years/list", ajv.compile(fiscalYearArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}
