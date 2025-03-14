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
  AccountingDate?: string | null; // Storing datetime as ISO string
  AccountCost?: number | null; // Representing decimal(10,2) as number
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
