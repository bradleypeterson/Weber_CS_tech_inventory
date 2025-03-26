import { JSONSchemaType } from "ajv";
import sha256 from "crypto-js/sha256";
import { ajv } from "../ajv";
import { get, post } from "./helpers";

export async function login(userId: string, password: string) {
  const saltResponse = await get(`/auth/salt?userId=${userId}`, validateSaltResponse);
  if (saltResponse.status === "error") return saltResponse;

  const hashDigest = sha256(password + saltResponse.data.salt);
  const hashedPassword = hashDigest.toString();
  const loginResponse = await post(`/auth/login`, { userId, password: hashedPassword }, validateLoginResponse);
  if (loginResponse.status === "error") return loginResponse;

  localStorage.setItem("token", loginResponse.data.token);
  localStorage.setItem("permissions", JSON.stringify(loginResponse.data.permissions));
  localStorage.setItem("personID", loginResponse.data.personID.toString());
  return loginResponse;
}

const saltResponseSchema: JSONSchemaType<{ salt: string }> = {
  type: "object",
  properties: {
    salt: { type: "string" }
  },
  required: ["salt"]
};

const validateSaltResponse = ajv.compile(saltResponseSchema);

const loginResponseSchema: JSONSchemaType<{ token: string; permissions: number[]; personID: number }> = {
  type: "object",
  properties: {
    token: { type: "string" },
    permissions: { type: "array", items: { type: "number" } },
    personID: { type: "number" }
  },
  required: ["token"]
};

const validateLoginResponse = ajv.compile(loginResponseSchema);
