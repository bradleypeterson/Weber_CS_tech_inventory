import { User, UserOverview } from "../../../@types/data";
import { userOverviewArraySchema, userSchema } from "../../../@types/schemas";
import { ajv } from "../ajv";
import { get, post, validateEmptyResponse } from "./helpers";

export async function fetchUserList(): Promise<UserOverview[] | undefined> {
  const response = await get("/users/list", ajv.compile(userOverviewArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function fetchUserDetails(personID: number): Promise<User | undefined> {
  const response = await get(`/users/${personID}`, ajv.compile(userSchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function updateUserDetails(
  personID: number,
  updates: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  const response = await post(`/users/${personID}/update`, updates, validateEmptyResponse);
  return response.status === "success";
}