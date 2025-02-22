import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { Column, Table } from "../../elements/Table/Tables";
import styles from "./UserSearchDashboard.module.css";

//TODO: get + icon to link to edit page (needs sidebar), and simplify navigation bar
export function UserSearchDashboard() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const dummyData = [
    { w_number: "W12345678", name: "Sally Student", departments: "CS", location: "NB 324A" },
    { w_number: "W00001212", name: "Sam Staff", departments: "CS, WEB, NET", location: "remote" },
    { w_number: "W10234567", name: "John Smith", departments: "NET", location: "EH 311B" }
  ];

  const columns: Column[] = [
    { key: "w_number", label: "W Number", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "departments", label: "Departments", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "edit", label: "Edit", type: "icon", icon: "edit", width: "10px", action: (row) => navigate("/userdetails", { state: { w_number: row.w_number, name: row.name}}) },
  ];

  const filteredData = useMemo(
    () => dummyData.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(searchText))),
    [searchText]
  );

  return (
    <main className={styles.layout}>
      <div className={styles.tableHeader}>
        <Link to="/adduser">
          <IconButton icon={<Plus />} variant="secondary" />
        </Link>
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


