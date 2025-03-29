import { JSONSchemaType } from "ajv";
import { Contact, ContactOverview } from "../../../@types/data";
import { contactOverviewArraySchema, contactSchema } from "../../../@types/schemas";
import { ajv } from "../ajv";
import { get, post } from "./helpers";

export async function fetchContactList(): Promise<ContactOverview[] | undefined> {
  const response = await get("/contacts/list", ajv.compile(contactOverviewArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function fetchContactDetails(personID: number): Promise<Contact | undefined> {
  const response = await get(`/contacts/${personID}`, ajv.compile(contactSchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function updateContactDetails(
  personID: string, WNumber: string, FirstName: string, LastName:string,
  DepartmentID: number[], BuildingID: number, RoomNumber: string
  ) {

  const response = await post(`/contacts/${personID}/update`, {
    personID, WNumber, FirstName, LastName, DepartmentID, BuildingID, RoomNumber}, validateContactResponse);
  return response;
}

export async function addContactDetails(
  WNumber: string, FirstName: string, LastName:string,
  DepartmentID: number[], BuildingID: number, RoomNumber: string
  ) {

  console.log(WNumber);
  const response = await post(`/contacts/add`, {
    WNumber, FirstName, LastName, DepartmentID, BuildingID, RoomNumber}, validateAddContactResponse);
  return response;
}

const updateContactResponseSchema: JSONSchemaType<{personID: string; }>
={
  type: "object",
  properties: {
    personID: { type: "string" },
    },
    required: ["personID"]
}

const validateContactResponse = ajv.compile(updateContactResponseSchema);

const addContactResponseSchema: JSONSchemaType<{ WNumber: string;}> 
={
  type: "object",
  properties: {
    WNumber: { type: "string" },
    },
    required: ["WNumber"]
}

const validateAddContactResponse = ajv.compile(addContactResponseSchema);