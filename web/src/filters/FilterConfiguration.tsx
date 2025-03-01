import type { ReactNode } from "react";
import { AssetClassFilter } from "./AssetClassFilter/AssetClassFilter";
import { DepartmentFilter } from "./DepartmentFilter/DepartmentFilter";
import { PermissionsFilter } from "./PermissionsFilter/PermissionsFilter";

export type FilterConfig = {
  Edit: ReactNode;
};

export type FilterValues = {
  Department?: number[];
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
};
