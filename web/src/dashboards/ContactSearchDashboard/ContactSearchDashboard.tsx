import { MagnifyingGlass, Pencil, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { ContactOverview } from "../../../../@types/data";
import { fetchContactList } from "../../api/contacts";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { Column, DynamicTable } from "../../elements/DynamicTable/DynamicTable";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { useFilters } from "../../filters/useFilters";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./ContactSearchDashboard.module.css";

export function ContactSearchDashboard() {
  const [searchText, setSearchText] = useState("");
  const [selectedContact, setSelectedContact] = useState<number[]>([]);
  const linkTo = useLinkTo();
  const { data } = useQuery('ContactsList', () => fetchContactList());
  const {filters} = useFilters();

  const filteredData = useMemo(() => {
    const filteredData = data?.filter(
      (row) => row.DepartmentID?.some(department => filters.Department?.includes(department))
  );
  const searchedData =
  searchText === ""
    ? (filteredData ?? [])
    : (filteredData?.filter((row) =>
        Object.values(row).some((value) => value.toString().toLowerCase().includes(searchText))
      ) ?? []);
  return searchedData;
  }, [searchText, data, filters]);

  const editDisabled = useMemo(() => selectedContact.length !== 1, [selectedContact]);

  function handleCheckbox(checked: boolean, personID: number) {
    setSelectedContact((prev) => {
      const nextSelectedContacts = [...prev];
      if (checked) {
        nextSelectedContacts.push(personID);
      } else {
        const index = nextSelectedContacts.findIndex((id) => id === personID);
        if (index > -1) nextSelectedContacts.splice(index, 1);
      }
      return nextSelectedContacts;
  });
}

  function handlePlusClick() {
    linkTo("Details", ["Admin", "Contacts"]);
  }

  function handleOnEdit() {
    if (selectedContact.length !== 1) return;
    linkTo("Details", ["Admin", "Contacts"], `personID=${selectedContact[0]}`);
  }

  const columns: Column<ContactOverview>[] = [
      {
        label: "",
        render: (row: ContactOverview) => (
          <>
            <Checkbox
              color="black"
              onChange={(value) => row.PersonID !== undefined && handleCheckbox(value, row.PersonID)}
              checked={row.PersonID !== undefined && selectedContact.includes(row.PersonID)}
            />
          </>
        )
      },
      { label: "W Number", dataIndex: "WNumber" },
      { label: "Name", dataIndex: "Name" },
      { label: "Department", dataIndex: "Departments" },
      { label: "Location", dataIndex: "Location" },
    ];

  return (
    <main className={styles.layout}>
      <div className={styles.tableHeader}>
        <div className={styles.row}>
          <IconButton icon={<Plus />} variant="secondary" onClick={handlePlusClick}/>
          <IconButton icon={<Pencil />} variant="secondary" disabled={editDisabled} onClick={handleOnEdit} />
        </div>
        <IconInput
          icon={<MagnifyingGlass />}
          width="200px"
          placeholder="search"
          value={searchText}
          onChange={(val) => setSearchText(val.toLowerCase())}
        />
      </div>
      <DynamicTable columns={columns} data={filteredData} />
    </main>
  );
}