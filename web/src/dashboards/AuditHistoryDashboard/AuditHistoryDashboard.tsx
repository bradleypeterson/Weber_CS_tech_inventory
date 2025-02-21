import { Briefcase } from "@phosphor-icons/react";
import { Column, DynamicTable } from "../../elements/DynamicTable/DynamicTable";
import { IconButton } from "../../elements/IconButton/IconButton";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AuditHistoryDashboard.module.css";

export function AuditHistoryDashboard() {
  return (
    <main className={styles.layout}>
      <h2>Audit History</h2>
      <div className={styles.tableContainer}>
        <DynamicTable columns={BuildColumns()} data={data} />
      </div>
    </main>
  );
}

type Data = {
  date: string;
  building: string;
  room: string;
  auditor: string;
  itemsMissing: boolean;
};

function BuildColumns() {
  const linkTo = useLinkTo();
  const columns: Column<Data>[] = [
    {
      label: "",
      render: () => (
        <IconButton
          onClick={() => linkTo("Audit Details", "Audits", "audit_id=3")}
          icon={<Briefcase />}
          variant="secondary"
          style={{ color: "var(--secondary-background)" }}
        />
      )
    },
    {
      dataIndex: "date",
      label: "Date"
    },
    {
      dataIndex: "building",
      label: "Building"
    },
    {
      dataIndex: "room",
      label: "Room"
    },
    {
      dataIndex: "auditor",
      label: "Auditor"
    },
    {
      dataIndex: "itemsMissing",
      label: "Items Missing"
    }
  ];

  return columns;
}

const data: Data[] = [
  {
    date: "2024-02-10",
    building: "Tracy Hall",
    room: "303",
    auditor: "Alice Johnson",
    itemsMissing: false
  },
  {
    date: "2023-09-15",
    building: "Tracy Hall",
    room: "301",
    auditor: "Bob Smith",
    itemsMissing: true
  },
  {
    date: "2023-11-21",
    building: "Tracy Hall",
    room: "302",
    auditor: "Charlie Brown",
    itemsMissing: true
  }
];
