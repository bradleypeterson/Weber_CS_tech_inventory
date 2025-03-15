export type AssetClass = {
  AssetClassID: number;
  Name: string;
  Abbreviation: string;
};

export type Department = {
  DepartmentID: number;
  Name: string;
  Abbreviation: string;
};

export type Permission = {
  PermissionID: number;
  Name: string;
};

type Asset = {
  EquipmentID: number;
  TagNumber: string;
  SerialNumber: string;
  Description: string;
  ContactPersonID?: number | null;
  LocationID?: number | null;
  DepartmentID?: number | null;
  AssetClassID: number;
  FiscalYearID?: number | null;
  ConditionID: number;
  DeviceTypeID: number;
  Manufacturer?: string | null;
  PartNumber?: string | null;
  Rapid7?: 1 | 0 | null;
  CrowdStrike?: 1 | 0 | null;
  ArchiveStatus?: 1 | 0 | null;
  PONumber?: string | null;
  SecondaryNumber?: string | null;
  AccountingDate?: string | null;
  AccountCost?: number | null;
};

type AssetOverview = {
  EquipmentID: number;
  TagNumber: string;
  ContactPersonFirstName?: string | null;
  ContactPersonLastName?: string | null;
  DepartmentID?: number | null;
  Department?: string | null;
  AssetClassID: number;
  AssetClass: string;
  DeviceTypeID: number;
  DeviceType: string;
};

type AssetDetails = {
  EquipmentID: number;
  TagNumber: string;
  SerialNumber: string;
  Description: string;
  DepartmentID?: number | null;
  DepartmentName?: string | null;
  LocationID?: number | null;
  RoomNumber?: string | null;
  Barcode?: string | null;
  BuildingName?: string | null;
  BuildingAbbr?: string | null;
  ContactPersonID?: number | null;
  ContactPersonFirstName?: string | null;
  ContactPersonLastName?: string | null;
  AssetClassID: number;
  AssetClassName?: string | null;
  FiscalYearID?: number | null;
  FiscalYear?: string | null;
  ConditionID: number;
  ConditionName?: string | null;
  DeviceTypeID: number;
  DeviceTypeName?: string | null;
  Manufacturer?: string | null;
  PartNumber?: string | null;
  Rapid7?: 1 | 0 | null;
  CrowdStrike?: 1 | 0 | null;
  ArchiveStatus?: 1 | 0 | null;
  PONumber?: string | null;
  SecondaryNumber?: string | null;
  AccountingDate?: string | null;
  AccountCost?: number | null;
};

type ContactOverview = {
  PersonID: number;
  WNumber: string;
  Name: string;
  Department: string;
  Location: string;
  DepartmentID: number;
};

type User = {
  PersonID: number;
  WNumber: string;
  Name: string;
  FirstName: string;
  LastName: string;
  Location: string;
  LocationID: number;
  Departments: string;
  DepartmentIDs: number[];
  Permissions: number[];
};

type UserOverview = {
  PersonID: number;
  WNumber: string;
  Name: string;
  Department: string;
  Location: string;
  DepartmentIDs: number[];
  Permissions: number[];
};