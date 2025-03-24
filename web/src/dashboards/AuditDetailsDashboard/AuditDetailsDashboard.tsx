import { Export, MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Notes } from "../../components/Notes/Notes";
import { Button } from "../../elements/Button/Button";
import { Column, DynamicTable } from "../../elements/DynamicTable/DynamicTable";
import { IconInput } from "../../elements/IconInput/IconInput";
import { useAuth } from "../../hooks/useAuth";
import styles from "./AuditDetailsDashboard.module.css";

export function AuditDetailsDashboard() {
  const { permissions } = useAuth();
  const [searchText, setSearchText] = useState("");
  const filteredData = useMemo(
    () => data.filter((row) => Object.values(row).some((value) => value.toString().toLowerCase().includes(searchText))),
    [searchText]
  );

  if (!permissions.includes(1)) {
    return (
      <main className={styles.layout}>
        <div className={styles.row}>
          <div style={{ color: "red" }}>You do not have permission to view audit details.</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>Audit Details</h2>
        </div>
        <Button icon={<Export />} variant="secondary" style={{ width: "fit-content" }}>
          Export
        </Button>
      </div>
      <div>
        <IconInput
          icon={<MagnifyingGlass />}
          width="200px"
          placeholder="search"
          value={searchText}
          onChange={(val) => setSearchText(val.toLowerCase())}
          style={{ marginLeft: "auto" }}
        />
        <DynamicTable columns={BuildColumns()} data={filteredData} width="100%" style={{ marginTop: "1rem" }} />
      </div>
      <Notes notes={[]} />
    </main>
  );
}

type Data = {
  tag_number: string;
  department: string;
  asset_class: string;
  device_type: string;
  contact_person: string;
  status: string;
};

function BuildColumns() {
  const columns: Column<Data>[] = [
    {
      dataIndex: "tag_number",
      label: "Tag Number"
    },
    {
      dataIndex: "department",
      label: "Department"
    },
    {
      dataIndex: "asset_class",
      label: "Asset Class"
    },
    {
      dataIndex: "device_type",
      label: "Device Type"
    },
    {
      dataIndex: "contact_person",
      label: "Contact Person"
    },
    {
      dataIndex: "status",
      label: "Status"
    }
  ];

  return columns;
}

const data: Data[] = [
  {
    tag_number: "XJ48ZK2M",
    department: "IT",
    asset_class: "Laptop",
    device_type: "Dell",
    contact_person: "John Doe",
    status: "Found"
  },
  {
    tag_number: "AB93TY7Q",
    department: "Finance",
    asset_class: "Printer",
    device_type: "HP",
    contact_person: "Jane Smith",
    status: "Found"
  },
  {
    tag_number: "LM74PQ9X",
    department: "HR",
    asset_class: "Desktop",
    device_type: "Lenovo",
    contact_person: "Michael Johnson",
    status: "Missing"
  },
  {
    tag_number: "RT82VW5Y",
    department: "Marketing",
    asset_class: "Server",
    device_type: "Apple",
    contact_person: "Emily Davis",
    status: "Missing"
  },
  {
    tag_number: "QP56NC3L",
    department: "Operations",
    asset_class: "Router",
    device_type: "Cisco",
    contact_person: "David Brown",
    status: "Found"
  }
];
