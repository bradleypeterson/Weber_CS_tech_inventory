import { Briefcase, MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Column, DynamicTable } from "../../elements/DynamicTable/DynamicTable";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AuditHistoryDashboard.module.css";

export function AuditHistoryDashboard() {
  const [searchText, setSearchText] = useState("");
  const filteredData = useMemo(
    () => data.filter((row) => Object.values(row).some((value) => value.toString().toLowerCase().includes(searchText))),
    [searchText]
  );

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <h2>Audit History</h2>
        <IconInput
          icon={<MagnifyingGlass />}
          width="200px"
          placeholder="search"
          value={searchText}
          onChange={(val) => setSearchText(val.toLowerCase())}
        />
      </div>
      <DynamicTable columns={BuildColumns()} data={filteredData} width="100%" />
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
          onClick={() => linkTo("Details", ["Audits", "History"], "audit_id=3")}
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
