import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "../../elements/Button/Button";
import { IconInput } from "../../elements/IconInput/IconInput";
import { Column, Table } from "../../elements/Table/Tables";
import styles from "./ContactSearchDashboard.module.css";

export function ContactSearchDashboard() {
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(
    () => dummyData.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(searchText))),
    [searchText]
  );

  return (
    <main className={styles.layout}>
      <div className={styles.tableHeader}>
        <IconInput
          icon={<MagnifyingGlass />}
          width="200px"
          placeholder="search"
          value={searchText}
          onChange={(val) => setSearchText(val.toLowerCase())}
        />
      </div>
      <Table columns={columns} data={filteredData} />
      <div className={styles.tableFooter}>
        <Button 
          variant="secondary" 
          size="normal">
          Add New Contact
        </Button>
      </div>
    </main>
  );
}

const dummyData = [
  { w_number: "W01234567", name: "Freddy Faculty", department: "WEB", location: "NB 311C" },
  { w_number: "W00001234", name: "Annie Adjunct", department: "CS", location: "remote" },
  { w_number: "W00123456", name: "John Smith", department: "NET", location: "EH 311B" }
];

const columns: Column[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "department", label: "Department", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "edit", label: "Edit", type: "icon", icon: "edit", width: "10px", action: () => alert("edit contact person") },
];
