import { useDashboardFilters } from "../../filters/useDashboardFilters";
import styles from "./FilterPanel.module.css";
export function FilterPanel() {
  const { filters } = useDashboardFilters();
  return <aside className={styles.filterPanel}>{filters && filters.map((filter) => filter.Edit)}</aside>;
}
