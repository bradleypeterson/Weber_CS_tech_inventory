import { MagnifyingGlass, Pencil } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "../../elements/Button/Button";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { Column, Table } from "../../elements/Table/Tables";
import styles from "./UserSearchDashboard.module.css";

export function UserSearchDashboard() {
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(
    () => dummyData.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(searchText))),
    [searchText]
  );

  return (
    <main className={styles.layout}>
      <div className={styles.tableHeader}>
        <IconButton icon={<Pencil />} variant="secondary" />
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
          Add New User
        </Button>
      </div>
    </main>
  );
}

const dummyData = [
  {
    w_number: "W12345678",
    name: "Sally Student",
    departments: "CS",
    location: "NB 324A",
  },
  {
    w_number: "W00001212",
    name: "Sam Staff",
    departments: "CS, WEB, NET",
    location: "remote",
  },
  {
    w_number: "W10234567",
    name: "John Smith",
    departments: "NET",
    location: "EH 311B",
  }
];

const columns: Column[] = [
  {
    // get checkbox
    label: "",
    key: "checkbox",
    type: "icon"
  },
  {
    label: "W Number",
    key: "w_number",
    type: "text"
  },
  {
    label: "Name",
    key: "name",
    type: "text"
  },
  {
    label: "Departments",
    key: "departments",
    type: "text"
  },
  {
    label: "Location",
    key: "location",
    type: "text"
  }
];
