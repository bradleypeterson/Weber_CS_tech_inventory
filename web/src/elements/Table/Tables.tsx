import { Briefcase, CaretDown, CheckSquare, FloppyDisk, Pencil, Plus, Square, Trash } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import styles from "./Tables.module.css";

export type Column = {
  key: string;
  label: string;
  type: "text" | "icon" | "dropdown";
  icon?: "edit" | "plus" | "trash" | "briefcase" | string | ((rowIndex: number) => string);
  action?: (rowIndex: number) => void;
  options?: { label: string; value: string | number }[];
  align?: "left" | "center" | "right";
  width?: string;
};

type TableProps = {
  columns: Column[];
  data: any[];
  selectable?: boolean;
  onDataChange?: (data: any[]) => void;
  setEditData?: (data: { name: string; abbreviation: string }) => void;
  iconColor?: string;
};

const getIcon = (iconName: string, rowIndex: number, editableRows: Set<number>, color: string) => {
  const commonProps = { size: 32, color };
  if (iconName === "save" && editableRows.has(rowIndex)) {
    return <FloppyDisk {...commonProps} />;
  }
  switch (iconName) {
    case "edit":
    case "save":
      return <Pencil {...commonProps} />;
    case "plus":
      return <Plus {...commonProps} />;
    case "trash":
      return <Trash {...commonProps} />;
    case "briefcase":
      return <Briefcase {...commonProps} />;
    default:
      return null;
  }
};

const Table: React.FC<TableProps> = ({
  columns,
  data,
  selectable,
  onDataChange,
  setEditData,
  iconColor = "inherit"
}) => {
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editableRows, setEditableRows] = useState<Set<number>>(new Set());
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    const newCheckedRows = new Set<number>();
    localData.forEach((row, index) => {
      if (row.status !== undefined && row.status !== null) {
        newCheckedRows.add(index);
      }
    });
    setCheckedRows(newCheckedRows);
  }, [localData]);

  const toggleCheck = (rowIndex: number) => {
    const row = localData[rowIndex];
    const updatedData = [...localData];

    if (checkedRows.has(rowIndex)) {
      updatedData[rowIndex] = { ...updatedData[rowIndex], status: null };
      setCheckedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rowIndex);
        return newSet;
      });
    } else {
      if (row.status !== undefined && row.status !== null) {
        setCheckedRows((prev) => new Set(prev).add(rowIndex));
      }
    }

    setLocalData(updatedData);
    onDataChange?.(updatedData);
  };

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleDropdownChange = (value: string | number, rowIndex: number, columnKey: string) => {
    const updatedData = [...localData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [columnKey]: value };
    setLocalData(updatedData);

    setCheckedRows((prev) => {
      const newSet = new Set(prev);
      if (value === undefined || value === null) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });

    onDataChange?.(updatedData);
    setOpenDropdown(null);
  };

  const toggleEditableRow = (rowIndex: number) => {
    setEditableRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
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
        {localData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {selectable && (
              <td onClick={() => toggleCheck(rowIndex)} style={{ cursor: "pointer", opacity: 1 }}>
                {checkedRows.has(rowIndex) ? <CheckSquare size={32} /> : <Square size={32} />}
              </td>
            )}
            {columns.map((column) => {
              const dropdownId = `${rowIndex}-${column.key}`;
              const currentIcon = typeof column.icon === "function" ? column.icon(rowIndex) : column.icon;

              return (
                <td key={column.key} style={{ width: column.width || "auto", textAlign: column.align || "left" }}>
                  {column.type === "text" &&
                    (editableRows.has(rowIndex) ? (
                      <input
                        type="text"
                        value={row[column.key]}
                        onChange={(e) => {
                          const updatedData = [...localData];
                          updatedData[rowIndex] = { ...updatedData[rowIndex], [column.key]: e.target.value };
                          setLocalData(updatedData);
                          setEditData?.({ ...updatedData[rowIndex] });
                        }}
                      />
                    ) : (
                      row[column.key]
                    ))}

                  {column.type === "icon" && currentIcon && (
                    <button
                      className={styles.iconButton}
                      onClick={() => {
                        if (currentIcon === "edit") {
                          toggleEditableRow(rowIndex);
                        } else if (currentIcon === "save") {
                          setEditableRows((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(rowIndex);
                            return newSet;
                          });
                        }
                        column.action?.(rowIndex);
                      }}
                    >
                      {getIcon(currentIcon, rowIndex, editableRows, iconColor)}
                    </button>
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
