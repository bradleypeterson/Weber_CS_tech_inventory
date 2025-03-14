import { Asset, AssetOverview } from "../../../@types/data";
import { assetArraySchema, assetOverviewArraySchema } from "../../../@types/schemas";
import { ajv } from "../ajv";
import { get } from "./helpers";

export async function fetchAssetsList(): Promise<Asset[] | undefined> {
  const response = await get("/assets/list", ajv.compile(assetArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}

export async function fetchAssetOverviewList(): Promise<AssetOverview[] | undefined> {
  const response = await get("/assets/list/overview", ajv.compile(assetOverviewArraySchema));
  if (response.status === "success") return response.data;
  return undefined;
}
