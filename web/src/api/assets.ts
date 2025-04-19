import { Asset, AssetOverview } from "../../../@types/data";
import {
  assetArraySchema,
  assetDetailsSchema,
  assetOverviewArraySchema,
  conditionArraySchema,
  deviceTypeArraySchema,
  notesSchema
} from "../../../@types/schemas";
import { ajv } from "../ajv";
import { get, post, validateEmptyResponse } from "./helpers";

export async function fetchAssetsList(): Promise<Asset[] | undefined> {
  const response = await get("/assets/list", ajv.compile(assetArraySchema));
  if (response.status === "success") return response.data as Asset[];
  return undefined;
}

export async function fetchAssetOverviewList(): Promise<AssetOverview[] | undefined> {
  const response = await get("/assets/list/overview", ajv.compile(assetOverviewArraySchema));
  if (response.status === "success") return response.data as AssetOverview[];
  return undefined;
}

export async function fetchAssetDetails(assetId: number): Promise<Asset | undefined> {
  const response = await get(`/assets/${assetId}`, ajv.compile(assetDetailsSchema));
  if (response.status === "success") return response.data as Asset;
  return undefined;
}

export async function updateAssetDetails(
  assetId: number,
  updates: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  const response = await post(`/assets/${assetId}/update`, updates, validateEmptyResponse);
  return response.status === "success";
}

export async function fetchConditions() {
  const response = await get(`/assets/conditions`, ajv.compile(conditionArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function fetchDeviceTypes() {
  const response = await get(`/assets/types`, ajv.compile(deviceTypeArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function addAsset(
  params: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  const response = await post(`/assets/add`, params, validateEmptyResponse);
  return response;
}

export async function fetchAssetNotes(assetId: number) {
  const response = await get(`/assets/${assetId}/notes`, ajv.compile(notesSchema));
  if (response.status === "success") return response.data;
  return [];
}

export async function addNewNote(assetId: number, note: string) {
  const response = await post(`/assets/${assetId}/notes`, { note }, validateEmptyResponse);
  return response;
}

export async function archiveAssets(assetIds: number[]) {
  const response = await post(`/assets/archive`, { assetIds }, validateEmptyResponse);
  return response;
}
