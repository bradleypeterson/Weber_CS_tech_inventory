import { MagnifyingGlass, Pencil, Trash } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { AssetOverview } from "../../../../@types/data";
import { fetchAssetOverviewList } from "../../api/assets";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { Column, DynamicTable } from "../../elements/DynamicTable/DynamicTable";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { useFilters } from "../../filters/useFilters";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AssetsSearchDashboard.module.css";

export function AssetsSearchDashboard() {
  const [searchText, setSearchText] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const { data } = useQuery("AssetsList", () => fetchAssetOverviewList());
  const { filters } = useFilters();
  const linkTo = useLinkTo();

  const filteredData = useMemo(() => {
    const filteredData = data?.filter(
      (row) => filters["Asset Class"]?.includes(row.AssetClassID) && filters.Department?.includes(row.DepartmentID ?? 0)
    );
    const searchedData =
      searchText === ""
        ? (filteredData ?? [])
        : (filteredData?.filter((row) =>
            Object.values(row).some((value) => value?.toString().toLowerCase().includes(searchText))
          ) ?? []);
    return searchedData;
  }, [searchText, data, filters]);

  const editDisabled = useMemo(() => selectedAssets.length !== 1, [selectedAssets]);
  const deleteDisabled = useMemo(() => selectedAssets.length === 0, [selectedAssets]);

  function handleCheckbox(checked: boolean, equipmentID: number) {
    setSelectedAssets((prev) => {
      const nextSelectedAssets = [...prev];
      if (checked) {
        nextSelectedAssets.push(equipmentID);
      } else {
        const index = nextSelectedAssets.findIndex((id) => id === equipmentID);
        if (index > -1) nextSelectedAssets.splice(index, 1);
      }
      return nextSelectedAssets;
    });
  }

  function handleOnEdit() {
    if (selectedAssets.length !== 1) return;
    linkTo("Asset Details", ["Assets"], `assetId=${selectedAssets[0]}`);
  }

  const columns: Column<AssetOverview>[] = [
    {
      label: "",
      render: (row: AssetOverview) => (
        <>
          <Checkbox
            color="black"
            onChange={(value) => handleCheckbox(value, row.EquipmentID)}
            checked={selectedAssets.includes(row.EquipmentID)}
          />
        </>
      )
    },
    {
      label: "Tag Number",
      dataIndex: "TagNumber"
    },
    {
      label: "Department",
      dataIndex: "Department"
    },
    {
      label: "Asset Class",
      dataIndex: "AssetClass"
    },
    {
      label: "Device Type",
      dataIndex: "DeviceType"
    }
  ];

  return (
    <main className={styles.layout}>
      <div className={styles.tableHeader}>
        <div className={styles.row}>
          <IconButton icon={<Trash />} variant="secondary" disabled={deleteDisabled} />
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
