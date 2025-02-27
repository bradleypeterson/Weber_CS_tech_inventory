import { MagnifyingGlass, Trash } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { fetchAssetsList } from "../../api/assets";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { Column, Table } from "../../elements/Table/Tables";
import styles from "./AssetsSearchDashboard.module.css";

export function AssetsSearchDashboard() {
  const [searchText, setSearchText] = useState("");
  const { data } = useQuery("AssetsList", () => fetchAssetsList());

  const filteredData = useMemo(
    () =>
      searchText === ""
        ? (data ?? [])
        : (data?.filter((row) =>
            Object.values(row).some((value) => value.toString().toLowerCase().includes(searchText))
          ) ?? []),
    [searchText, data]
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

const columns: Column[] = [
  {
    label: "Tag Number",
    key: "TagNumber",
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
