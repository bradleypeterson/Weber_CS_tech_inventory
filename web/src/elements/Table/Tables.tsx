import { Briefcase, CaretDown, CheckSquare, FloppyDisk, Pencil, Plus, Square, Trash } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import styles from "./Tables.module.css";
//will need to import the icons used in the table once those are done

//takes in different column sizes and definitions(db data or icons) as props. Then builds out the table for each column then for each row.

export type Column = {
  key: string;
  label: string;
  type: "text" | "icon" | "dropdown";
  icon?: "edit" | "plus" | "trash" | "briefcase" | string;
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
};

const getIcon = (iconName: string, rowIndex: number, editableRows: Set<number>) => {
  if (iconName === "edit" && editableRows.has(rowIndex)) {
    return <FloppyDisk size={32} />;
  }
  switch (iconName) {
    case "edit":
      return <Pencil size={32} />;
    case "plus":
      return <Plus size={32} />;
    case "trash":
      return <Trash size={32} />;
    case "briefcase":
      return <Briefcase size={32} />;
    default:
      return null;
  }
};

const Table: React.FC<TableProps> = ({ columns, data, selectable, onDataChange }) => {
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editableRows, setEditableRows] = useState<Set<number>>(new Set());
  const [localData, setLocalData] = useState(data);

  // Update local data when prop data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Update checked rows when localData changes
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
      // When unchecking, reset the status to null
      updatedData[rowIndex] = { 
        ...updatedData[rowIndex], 
        status: null  
      };
      
      // Update checked rows
      setCheckedRows(prev => {
        const newChecked = new Set(prev);
        newChecked.delete(rowIndex);
        return newChecked;
      });
    } else {
      if (row.status === undefined || row.status === null) {
        return; // Don't allow checking if no status
      }
      setCheckedRows(prev => {
        const newChecked = new Set(prev);
        newChecked.add(rowIndex);
        return newChecked;
      });
    }
    
    setLocalData(updatedData);
    
    // Notify parent component
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleDropdownChange = (value: string | number, rowIndex: number, columnKey: string) => {
    const updatedData = [...localData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [columnKey]: value };
    setLocalData(updatedData);
    
    // Automatically check the row when status is set
    setCheckedRows(prev => {
      const newChecked = new Set(prev);
      if (value === undefined || value === null) {
        newChecked.delete(rowIndex);
      } else {
        newChecked.add(rowIndex);
      }
      return newChecked;
    });
    
    if (onDataChange) {
      onDataChange(updatedData);
    }
    setOpenDropdown(null);
  };

  const toggleEditableRow = (rowIndex: number) => {
    setEditableRows((prev) => {
      const newEditableRows = new Set(prev);
      if (newEditableRows.has(rowIndex)) {
        newEditableRows.delete(rowIndex);
      } else {
        newEditableRows.add(rowIndex);
      }
      return newEditableRows;
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
              <td 
                onClick={() => {
                  toggleCheck(rowIndex);
                }}
                style={{ 
                  cursor: 'pointer',
                  opacity: 1
                }}
              >
                {checkedRows.has(rowIndex) ? <CheckSquare size={32} /> : <Square size={32} />}
              </td>
            )}
            {columns.map((column) => {
              const dropdownId = `${rowIndex}-${column.key}`;
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
                        }}
                      />
                    ) : (
                      row[column.key]
                    ))}
                  {column.type === "icon" && column.icon && (
                    <button
                      onClick={() => {
                        if (column.icon === "edit") {
                          toggleEditableRow(rowIndex);
                        }
                        column.action?.(rowIndex);
                      }}
                    >
                      {getIcon(column.icon, rowIndex, editableRows)}
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
