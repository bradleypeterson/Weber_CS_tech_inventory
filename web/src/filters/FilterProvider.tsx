import { ReactNode, useState } from "react";
import { FilterValues } from "./FilterConfiguration";
import { FilterContext } from "./FilterContext";

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({});

  function setFilter<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
    console.log(key, value);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function selectFilter<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setSelectedFilters(filters);
  }

  function apply() {
    setFilters((prev) => ({ ...prev, ...selectedFilters }));
  }

  return (
    <FilterContext.Provider value={{ filters, setFilter, resetFilters, selectFilter, apply, selectedFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
