import { MagnifyingGlass, Trash } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { Column, Table } from "../../elements/Table/Tables";
import styles from "./AssetsSearchDashboard.module.css";

export function AssetsSearchDashboard() {
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(
    () => dummyData.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(searchText))),
    [searchText]
  );

  return (
    <main className={styles.layout}>
      <div className={styles.tableHeader}>
        <IconButton icon={<Trash />} variant="secondary" />
        <IconInput
          icon={<MagnifyingGlass />}
          width="200px"
          placeholder="search"
          value={searchText}
          onChange={(val) => setSearchText(val.toLowerCase())}
        />
      </div>
      <Table columns={columns} data={filteredData} />
    </main>
  );
}

const dummyData = [
  {
    tag_number: "100102",
    department: "Physics",
    asset_class: "COMPUTERS",
    device_type: "Laptop",
    contact_person: "Alice Johnson"
  },
  {
    tag_number: "100248",
    department: "Mathematics",
    asset_class: "MONITORS",
    device_type: "Monitor",
    contact_person: "David Smith"
  },
  {
    tag_number: "100311",
    department: "Computer Science",
    asset_class: "PRINTERS",
    device_type: "Printer",
    contact_person: "Brad Petersen"
  },
  {
    tag_number: "100456",
    department: "Biology",
    asset_class: "SERVERS",
    device_type: "Rack Server",
    contact_person: "Emma Wilson"
  },
  {
    tag_number: "100579",
    department: "Chemistry",
    asset_class: "TABLETS",
    device_type: "iPad",
    contact_person: "John Doe"
  }
];

const columns: Column[] = [
  {
    label: "Tag Number",
    key: "tag_number",
    type: "text"
  },
  {
    label: "Department",
    key: "department",
    type: "text"
  },
  {
    label: "Asset Class",
    key: "asset_class",
    type: "text"
  },
  {
    label: "Device Type",
    key: "device_type",
    type: "text"
  },
  {
    label: "Contact Person",
    key: "contact_person",
    type: "text"
  }
];
