import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { Column, Table } from "../../elements/Table/Tables";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./ContactSearchDashboard.module.css";

export function ContactSearchDashboard() {
  const [searchText, setSearchText] = useState("");
  const linkTo = useLinkTo();

  const columns: Column[] = [
    { key: "w_number", label: "W Number", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "department", label: "Department", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "edit", label: "Edit", type: "icon", icon: "edit", width: "10px", action:() => linkTo("Details", ["Admin", "Contacts"], "w_number=W01234567")},
  ];

  const filteredData = useMemo(
    () => dummyData.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(searchText))),
    [searchText]
  );

  return (
    <main className={styles.layout}>
      <div className={styles.tableHeader}>
          <IconButton icon={<Plus />} variant="secondary" onClick={() => linkTo("Details", ["Admin", "Contacts"])}/>
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
  { w_number: "W01234567", name: "Freddy Faculty", department: "WEB", location: "NB 311C" },
  { w_number: "W00001234", name: "Annie Adjunct", department: "CS", location: "remote" },
  { w_number: "W00123456", name: "John Smith", department: "NET", location: "EH 311B" }
];


