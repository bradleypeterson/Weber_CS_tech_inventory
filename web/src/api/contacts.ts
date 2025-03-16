import { Contact, ContactOverview } from "../../../@types/data";
import { contactOverviewArraySchema, contactSchema } from "../../../@types/schemas";
import { ajv } from "../ajv";
import { get, post, validateEmptyResponse } from "./helpers";

export async function fetchContactList(): Promise<ContactOverview[] | undefined> {
  const response = await get("/contacts/list", ajv.compile(contactOverviewArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function fetchContactDetails(personID: number): Promise<Contact | undefined> {
  const response = await get(`/contact/${personID}`, ajv.compile(contactSchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function updateContactDetails(
  personID: number,
  updates: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  const response = await post(`/contacts/${personID}/update`, updates, validateEmptyResponse);
  return response.status === "success";
}