import React from "react";
import styles from "./Tables.module.css";
//will need to import the icons used in the table once those are done

//takes in different column sizes and definitions(db data or icons) as props. Then builds out the table for each column then for each row.

interface Column {
  key: string;
  label: string;
  type: "text" | "icon";
  icon?: string; //not sure how to handle this exactly, but this is for the different potential icons we could be calling
  action?: () => void;
}

interface TableProps {
  columns: Column[];
  data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.key}>
                {column.type === "text" ? row[column.key] : <button onClick={column.action}>{column.icon}</button>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table };
