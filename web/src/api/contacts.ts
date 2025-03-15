import { ContactOverview } from "../../../@types/data";
import { contactOverviewArraySchema } from "../../../@types/schemas";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchContactList(): Promise<ContactOverview[] | undefined> {
  const response = await get("/contacts/list", ajv.compile(contactOverviewArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}