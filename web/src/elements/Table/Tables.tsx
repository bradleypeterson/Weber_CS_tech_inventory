import { CaretDown, CheckSquare, Pencil, Plus, Square, Trash } from "@phosphor-icons/react";
import React, { useState } from "react";
import styles from "./Tables.module.css";
//will need to import the icons used in the table once those are done

//takes in different column sizes and definitions(db data or icons) as props. Then builds out the table for each column then for each row.

export type Column = {
  key: string;
  label: string;
  type: "text" | "icon" | "dropdown";
  icon?: "edit" | "plus" | "trash" | string;
  action?: () => void;
  options?: { label: string; value: string | number }[];
  align?: "left" | "center" | "right";
  width?: string;
};

type TableProps = {
  columns: Column[];
  data: any[];
  selectable?: boolean;
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "edit":
      return <Pencil size={32} />;
    case "plus":
      return <Plus size={32} />;
    case "trash":
      return <Trash size={32} />;
    default:
      return null;
  }
};

const Table: React.FC<TableProps> = ({ columns, data, selectable }) => {
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleCheck = (rowIndex: number) => {
    setCheckedRows((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(rowIndex)) newChecked.delete(rowIndex);
      else newChecked.add(rowIndex);
      return newChecked;
    });
  };

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleDropdownChange = (value: string | number, rowIndex: number, columnKey: string) => {
    if (onDataChange) {
      const updatedData = [...data];
      updatedData[rowIndex] = { ...updatedData[rowIndex], [columnKey]: value };
      onDataChange(updatedData);
    }
    setOpenDropdown(null);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {selectable && <th className={styles.checkboxHeader}></th>}
          {columns.map((column) => (
            <th key={column.key} style={{ width: column.width || "auto", textAlign: column.align || "left" }}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {selectable && (
              <td onClick={() => toggleCheck(rowIndex)}>
                {checkedRows.has(rowIndex) ? <CheckSquare size={32} /> : <Square size={32} />}
              </td>
            )}
            {columns.map((column) => {
              const dropdownId = `${rowIndex}-${column.key}`;
              return (
                <td key={column.key} style={{ width: column.width || "auto", textAlign: column.align || "left" }}>
                  {column.type === "text" && row[column.key]}
                  {column.type === "icon" && column.icon && (
                    <button onClick={column.action}>{getIcon(column.icon)}</button>
                  )}
                  {column.type === "dropdown" && column.options && (
                    <div className={styles.dropdownContainer} style={{ position: "relative" }}>
                      <div
                        className={styles.dropdownSelect}
                        onClick={() => toggleDropdown(dropdownId)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer"
                        }}
                      >
                        <span>
                          {column.options.find((opt) => opt.value === row[column.key])?.label || "pick status"}
                        </span>
                        <CaretDown
                          style={{
                            transform: openDropdown === dropdownId ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "0.1s ease-in-out"
                          }}
                        />
                      </div>
                      {openDropdown === dropdownId && (
                        <div className={styles.dropdownMenu}>
                          {column.options.map((option) => (
                            <div
                              key={option.value}
                              onClick={() => handleDropdownChange(option.value, rowIndex, column.key)}
                              className={styles.dropdownOption}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table };
