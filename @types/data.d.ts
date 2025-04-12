export type AssetClass = {
  AssetClassID: number;
  Name: string;
  Abbreviation: string;
};

export type Building = {
  BuildingID: number;
  Name: string;
  Abbreviation: string;
};

export type Room = {
  LocationID: number;
  RoomNumber: string;
  BuildingID: number;
  Barcode: string;
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
  BuildingID?: number | null;
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

type Contact = {
  WNumber: string;
  FullName?: string | null;
  FirstName: string;
  LastName: string;
  LocationID?: number | null;
  BuildingID?: number | null;
  Departments?: string | null;
  DepartmentID: number[];
};

type ContactOverview = {
  PersonID: number;
  WNumber: string;
  FullName: string;
  Departments: string;
  Location: string;
  DepartmentID: number[];
};

type User = {
  UserID: number;
  WNumber: string;
  Name: string;
  FirstName: string;
  LastName: string;
  Location: string;
  BuildingID?: number | null;
  BuildingAbbreviation?: string | null;
  BuildingName?: string | null;
  RoomNumber?: string | null;
  LocationID: number;
  Departments: string;
  DepartmentID: number[];
  Permissions: number[];
  Permission1: number;
  Permission2: number;
  Permission3: number;
  Permission4: number;
  Permission5: number;
  Permission6: number;
  Permission7: number;
};

type UserOverview = {
  PersonID: number;
  UserID: number;
  WNumber: string;
  Name: string;
  Departments: string;
  Location: string;
  DepartmentID: number[];
  Permissions: number[];
};

type Condition = {
  ConditionID: number;
  ConditionName: string;
  ConditionAbbreviation: string;
};

type DeviceType = {
  DeviceTypeID: number;
  Name: string;
  Abbreviation: string;
};

type FiscalYear = {
  ReplacementID: number;
  Year: string;
};

type Note = {
  NoteID: number;
  CreatedBy: number;
  EquipmentID: number;
  Note: string;
  CreatedAt: string;
};
