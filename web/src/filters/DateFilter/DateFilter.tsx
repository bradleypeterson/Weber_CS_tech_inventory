import { Calendar } from "@phosphor-icons/react";
import { ChangeEvent } from "react";
import { useFilters } from "../useFilters";
import styles from "./DateFilter.module.css";

export function DateFilter() {
  const { filters, selectedFilters, selectFilter } = useFilters();

  return (
    <div className={styles.filterContainer}>
      <p>Date</p>
      <div className={styles.inputContainer}>
        <input
          type="date"
          placeholder="Select Date"
          value={selectedFilters["Date"]?.[0] ?? filters["Date"]?.[0] ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            selectFilter("Date", e.target.value ? [e.target.value] : []);
          }}
          className={styles.dateInput}
        />
        <Calendar className={styles.calendarIcon} weight="light" />
      </div>
    </div>
  );
} 