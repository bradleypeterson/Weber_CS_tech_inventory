import { CheckSquare, Pencil, Plus, Trash } from "@phosphor-icons/react";
import React from "react";
import styles from "./Tables.module.css";
//will need to import the icons used in the table once those are done

//takes in different column sizes and definitions(db data or icons) as props. Then builds out the table for each column then for each row.

export type Column = {
  key: string;
  label: string;
  type: "text" | "icon";
  icon?: "edit" | "plus" | "trash" | string;
  action?: () => void;
  options?: { label: string; value: string | number }[];
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
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {selectable && <th className={styles.checkboxHeader}></th>}
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {selectable && (
              <td>
                <CheckSquare size={32} />
              </td>
            )}
            {columns.map((column) => (
              <td key={column.key}>
                {column.type === "text" && row[column.key]}
                {column.type === "icon" && column.icon && (
                  <button onClick={column.action}>{getIcon(column.icon)}</button>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table };
