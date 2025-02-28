import { createContext } from "react";

export type FilterValues = {
  Department?: number[];
};

export type FilterContextType = {
  filters: FilterValues;
  selectedFilters: FilterValues;
  setFilter: <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => void;
  selectFilter: <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => void;
  apply: () => void;
  resetFilters: () => void;
};

export const FilterContext = createContext<FilterContextType | undefined>(undefined);
