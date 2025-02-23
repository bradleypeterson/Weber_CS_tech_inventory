import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { Column, Table } from "../../elements/Table/Tables";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./UserSearchDashboard.module.css";

//TODO: get + icon to link to edit page (needs sidebar), and simplify navigation bar
export function UserSearchDashboard() {
  const [searchText, setSearchText] = useState("");
  const linkTo = useLinkTo();

  const dummyData = [
    { w_number: "W10234567", name: "Sally Student", departments: "CS", location: "NB 324A" },
    { w_number: "W00001212", name: "Sam Staff", departments: "CS, WEB, NET", location: "remote" },
    { w_number: "W12345678", name: "John Smith", departments: "NET", location: "EH 311B" }
  ];

  const columns: Column[] = [
    { key: "w_number", label: "W Number", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "departments", label: "Departments", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "edit", label: "Edit", type: "icon", icon: "edit", width: "10px", action: () => linkTo("Details", ["Admin", "Users"], "w_number=W01234567" ) },
  ];

  const filteredData = useMemo(
    () => dummyData.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(searchText))),
    [searchText]
  );

  return (
    <main className={styles.layout}>
      <div className={styles.tableHeader}>
        <IconButton icon={<Plus />} variant="secondary" onClick={() => linkTo("Details", ["Admin", "Users"])}/>
        <IconInput
          icon={<MagnifyingGlass />} 
          width="200px"
          placeholder="search"
          value={searchText}
          onChange={(val) => setSearchText(val.toLowerCase())}>
        </IconInput>
      </div>
      <Table columns={columns} data={filteredData} />
    </main>
  );
}


