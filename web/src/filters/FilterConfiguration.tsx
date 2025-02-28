import type { ReactNode } from "react";
import { DepartmentFilter } from "./DepartmentFilter/DepartmentFilter";

export type FilterConfig = {
  Edit: ReactNode;
};

export type FilterValues = {
  Department?: number[];
};

export const filterConfiguration: Record<keyof FilterValues, FilterConfig> = {
  Department: {
    Edit: <DepartmentFilter />
  }
};
