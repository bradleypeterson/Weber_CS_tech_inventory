import type { JSONSchemaType } from "ajv";
import type { Asset, AssetDetails, AssetOverview } from "./data";

export const assetSchema: JSONSchemaType<Asset> = {
  type: "object",
  properties: {
    EquipmentID: { type: "number" },
    TagNumber: { type: "string" },
    SerialNumber: { type: "string" },
    Description: { type: "string" },
    ContactPersonID: { type: "number", nullable: true },
    LocationID: { type: "number", nullable: true },
    DepartmentID: { type: "number", nullable: true },
    AssetClassID: { type: "number" },
    FiscalYearID: { type: "number", nullable: true },
    ConditionID: { type: "number" },
    DeviceTypeID: { type: "number" },
    Manufacturer: { type: "string", nullable: true },
    PartNumber: { type: "string", nullable: true },
    Rapid7: { type: "number", enum: [1, 0], nullable: true },
    CrowdStrike: { type: "number", enum: [1, 0], nullable: true },
    ArchiveStatus: { type: "number", enum: [1, 0], nullable: true },
    PONumber: { type: "string", nullable: true },
    SecondaryNumber: { type: "string", nullable: true },
    AccountingDate: { type: "string", nullable: true },
    AccountCost: { type: "number", nullable: true },
  },
  required: [
    "EquipmentID",
    "TagNumber",
    "SerialNumber",
    "Description",
    "AssetClassID",
    "ConditionID",
    "DeviceTypeID",
  ],
  additionalProperties: false,
};

export const assetArraySchema: JSONSchemaType<Asset[]> = {
  type: "array",
  items: assetSchema,
};

export const assetOverviewSchema: JSONSchemaType<AssetOverview> = {
  type: "object",
  properties: {
    EquipmentID: { type: "number" },
    TagNumber: { type: "string" },
    ContactPersonFirstName: { type: "string", nullable: true },
    ContactPersonLastName: { type: "string", nullable: true },
    DepartmentID: { type: "number", nullable: true },
    Department: { type: "string", nullable: true },
    AssetClassID: { type: "number" },
    AssetClass: { type: "string" },
    DeviceTypeID: { type: "number" },
    DeviceType: { type: "string" },
  },
  required: [
    "EquipmentID",
    "TagNumber",
    "AssetClassID",
    "AssetClass",
    "DeviceTypeID",
    "DeviceType",
  ],
};

export const assetOverviewArraySchema: JSONSchemaType<AssetOverview[]> = {
  type: "array",
  items: assetOverviewSchema,
};

export const assetDetailsSchema: JSONSchemaType<AssetDetails> = {
  type: "object",
  properties: {
    EquipmentID: { type: "number" },
    TagNumber: { type: "string" },
    SerialNumber: { type: "string" },
    Description: { type: "string" },
    DepartmentID: { type: "number", nullable: true },
    DepartmentName: { type: "string", nullable: true },
    LocationID: { type: "number", nullable: true },
    RoomNumber: { type: "string", nullable: true },
    Barcode: { type: "string", nullable: true },
    BuildingName: { type: "string", nullable: true },
    BuildingAbbr: { type: "string", nullable: true },
    ContactPersonID: { type: "number", nullable: true },
    ContactPersonFirstName: { type: "string", nullable: true },
    ContactPersonLastName: { type: "string", nullable: true },
    AssetClassID: { type: "number" },
    AssetClassName: { type: "string", nullable: true },
    FiscalYearID: { type: "number", nullable: true },
    FiscalYear: { type: "string", nullable: true },
    ConditionID: { type: "number" },
    ConditionName: { type: "string", nullable: true },
    DeviceTypeID: { type: "number" },
    DeviceTypeName: { type: "string", nullable: true },
    Manufacturer: { type: "string", nullable: true },
    PartNumber: { type: "string", nullable: true },
    Rapid7: { type: "number", enum: [1, 0], nullable: true },
    CrowdStrike: { type: "number", enum: [1, 0], nullable: true },
    ArchiveStatus: { type: "number", enum: [1, 0], nullable: true },
    PONumber: { type: "string", nullable: true },
    SecondaryNumber: { type: "string", nullable: true },
    AccountingDate: { type: "string", nullable: true },
    AccountCost: { type: "number", nullable: true },
  },
  required: [
    "EquipmentID",
    "TagNumber",
    "SerialNumber",
    "Description",
    "AssetClassID",
    "ConditionID",
    "DeviceTypeID",
  ],
  additionalProperties: false,
};
