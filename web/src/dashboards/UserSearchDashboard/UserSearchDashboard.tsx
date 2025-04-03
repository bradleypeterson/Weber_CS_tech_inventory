import { MagnifyingGlass, Pencil, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { UserOverview } from "../../../../@types/data";
import { fetchUserList } from "../../api/users";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { Column, DynamicTable } from "../../elements/DynamicTable/DynamicTable";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { useFilters } from "../../filters/useFilters";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./UserSearchDashboard.module.css";

export function UserSearchDashboard() {
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<number[]>([]);
  const linkTo = useLinkTo();
  const { data } = useQuery('UsersList', () => fetchUserList());
  const {filters} = useFilters();

  const filteredData = useMemo(() => {
    const filteredData = data?.filter(
      (row) => {
      const deptMatch = row.DepartmentID?.some(department => filters.Department?.includes(department));
      const permissionMatch = row.Permissions?.some((permission) =>
        filters.Permission?.includes(Number(permission)));
      const permissionSelected = filters.Permission ? filters.Permission.length > 0 : false;
      if( permissionSelected ){
        return deptMatch && permissionMatch;
      }
      else return deptMatch && true;
    });
  const searchedData =
  searchText === ""
    ? (filteredData ?? [])
    : (filteredData?.filter((row) =>
        Object.values(row).some((value) => value.toString().toLowerCase().includes(searchText))
      ) ?? []);
  return searchedData;
  }, [searchText, data, filters]);

  const editDisabled = useMemo(() => selectedUser.length !== 1, [selectedUser]);

  function handleCheckbox(checked: boolean, personID: number) {
    setSelectedUser((prev) => {
      const nextSelectedUsers = [...prev];
      if (checked) {
        nextSelectedUsers.push(personID);
      } else {
        const index = nextSelectedUsers.findIndex((id) => id === personID);
        if (index > -1) nextSelectedUsers.splice(index, 1);
      }
      return nextSelectedUsers;
  });
}
  
  function handlePlusClick() {
    linkTo("Details", ["Admin", "Users"]);
  }

  function handleOnEdit() {
    if (selectedUser.length !== 1) return;
    linkTo("Details", ["Admin", "Users"], `personID=${selectedUser[0]}`);
  }
  
  const columns: Column<UserOverview>[] = [
        {
          label: "",
          render: (row: UserOverview) => (
            <>
              <Checkbox
                color="black"
                onChange={(value) => row.PersonID !== undefined && handleCheckbox(value, row.PersonID)}
                checked={row.PersonID !== undefined && selectedUser.includes(row.PersonID)}
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


