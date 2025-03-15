import type { ReactNode } from "react";
import { AssetClassFilter } from "./AssetClassFilter/AssetClassFilter";
import { BuildingFilter } from "./BuildingFilter/BuildingFilter";
import { DepartmentFilter } from "./DepartmentFilter/DepartmentFilter";
import { PermissionsFilter } from "./PermissionsFilter/PermissionsFilter";
import { RoomFilter } from "./RoomFilter/RoomFilter";

export type FilterConfig = {
  Edit: ReactNode;
};

export type FilterValues = {
  Department?: number[];
  Building?: number[];
  Room?: number[];
  "Asset Class"?: number[];
  Permission?: number[];
};

export const filterConfiguration: Partial<Record<keyof FilterValues, FilterConfig>> = {
  Department: {
    Edit: <DepartmentFilter />
  }, 
  "Asset Class": {
    Edit: <AssetClassFilter />
  },
  Permission: {
    Edit: <PermissionsFilter />
  },
  Building: {
    Edit: <BuildingFilter />
  },
  Room: {
    Edit: <RoomFilter />
  },
};
