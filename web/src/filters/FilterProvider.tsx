import { ReactNode, useEffect, useState } from "react";
import { FilterValues } from "./FilterConfiguration";
import { FilterContext } from "./FilterContext";

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({});

  useEffect(function syncPreviousFilter() {
    const storedFilters = localStorage.getItem("filters");
    if (storedFilters === null) return;
    const parsedFilters = JSON.parse(storedFilters);
    setFilters(parsedFilters);
    setSelectedFilters(parsedFilters);
  }, []);

  function setFilter<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      console.log(newFilters);
      localStorage.setItem("filters", JSON.stringify(newFilters));
      return newFilters;
    });
  }

  function selectFilter<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setSelectedFilters(filters);
  }

  function apply() {
    setFilters((prev) => {
      const newFilters = { ...prev, ...selectedFilters };
      localStorage.setItem("filters", JSON.stringify(newFilters));
      return newFilters;
    });
  }

  return (
    <FilterContext.Provider value={{ filters, setFilter, resetFilters, selectFilter, apply, selectedFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
