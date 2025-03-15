import { UserOverview } from "../../../@types/data";
import { userOverviewArraySchema } from "../../../@types/schemas";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchUserList(): Promise<UserOverview[] | undefined> {
  const response = await get("/users/list", ajv.compile(userOverviewArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}