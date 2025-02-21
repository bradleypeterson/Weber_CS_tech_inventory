import { JSONSchemaType } from "ajv";
import sha256 from "crypto-js/sha256";
import { ajv } from "../ajv";
import { get, post } from "./helpers";

export async function login(username: string, password: string) {
  const { salt } = await get(`/auth/salt?username=${username}`, validateSaltResponse);
  const hashDigest = sha256(password + salt);
  const hashedPassword = hashDigest.toString();
  const response = await post(`/auth/login`, { username, password: hashedPassword }, validateLoginResponse);
  localStorage.setItem("token", response.token);

  return true;
}

const saltResponseSchema: JSONSchemaType<{ salt: string }> = {
  type: "object",
  properties: {
    salt: { type: "string" }
  },
  required: ["salt"]
};

const validateSaltResponse = ajv.compile(saltResponseSchema);

const loginResponseSchema: JSONSchemaType<{ token: string }> = {
  type: "object",
  properties: {
    token: { type: "string" }
  },
  required: ["token"]
};

const validateLoginResponse = ajv.compile(loginResponseSchema);
