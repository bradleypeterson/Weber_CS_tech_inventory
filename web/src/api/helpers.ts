import { ValidateFunction } from "ajv";
import { APIErrorResponse, APIResponse, APISuccessResponse } from "../../../@types/api";
import { ajv } from "../ajv";
const apiURL = import.meta.env.VITE_API_URL;

export async function post<T>(
  endpoint: string,
  body: unknown,
  validator: ValidateFunction<T>
): Promise<APIErrorResponse | APISuccessResponse<T>> {
  const url = `${apiURL}${endpoint}`;
  const options: RequestInit = {
    method: "POST",
    redirect: "follow",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };

  const result = await fetch(url, options);
  const response = await result.json();

  if (!validateApiResponse(response)) {
    console.error(validateApiResponse.errors);
    throw Error("Invalid api response");
  }

  if (response.status === "error") return response;

  if (validator(response.data)) return response;
  else {
    console.error(validator.errors);
    throw Error("Failed to validate data");
  }
}

export async function get<T>(
  endpoint: string,
  validator: ValidateFunction<T>
): Promise<APIErrorResponse | APISuccessResponse<T>> {
  const url = `${apiURL}${endpoint}`;
  const options: RequestInit = {
    method: "GET",
    redirect: "follow",
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  };

  const result = await fetch(url, options);
  const response = await result.json();

  if (!validateApiResponse(response)) {
    console.error(validateApiResponse.errors);
    throw Error("Invalid api response");
  }

  if (response.status === "error") return response;

  if (validator(response.data)) return response;
  else {
    console.error(validator.errors);
    throw Error("Failed to validate data");
  }
}

const apiResponseSchema = {
  oneOf: [
    {
      type: "object",
      properties: {
        status: { type: "string", enum: ["success"] },
        data: {
          oneOf: [
            { type: "object", additionalProperties: true },
            { type: "array", items: { type: "object", additionalProperties: true } }
          ] // Allows any structure for `data`
        }
      },
      required: ["status", "data"],
      additionalProperties: false
    },
    {
      type: "object",
      properties: {
        status: { type: "string", enum: ["error"] },
        error: {
          type: "object",
          properties: {
            message: { type: "string" },
            code: { type: ["string", "number"], nullable: true },
            details: { type: "string", nullable: true }
          },
          required: ["message"]
        }
      },
      required: ["status", "error"],
      additionalProperties: false
    }
  ]
} as const;

const validateApiResponse: ValidateFunction<APIResponse> = ajv.compile(apiResponseSchema);
