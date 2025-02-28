import { useMemo } from "react";
import { useDashboard } from "../navigation/useDashboard";
import { FilterConfig, filterConfiguration } from "./FilterConfiguration";

export function useDashboardFilters() {
  const { dashboard } = useDashboard();

  const filters = useMemo(() => {
    if (!dashboard || dashboard.filters === undefined) return undefined;
    const configurations: FilterConfig[] = [];
    for (const filter of dashboard.filters) {
      const filterConfig = filterConfiguration[filter];
      if (filterConfig) configurations.push(filterConfig);
    }

    return configurations;
  }, [dashboard]);

  return { filters };
}
