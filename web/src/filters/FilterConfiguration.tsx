import type { ReactNode } from "react";
import { DepartmentFilter } from "./DepartmentFilter/DepartmentFilter";

export type FilterConfig = {
  Edit: ReactNode;
};

export const filterConfiguration: Record<string, FilterConfig> = {
  Department: {
    Edit: <DepartmentFilter />
  }
};
