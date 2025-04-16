import { useState } from "react";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { Table } from "../../elements/Table/Tables";

export function EditListDashboard() {
  const [activeList, setActiveList] = useState<string>("department");

  const listOptions = [
    { value: "department", label: "Department" },
    { value: "building", label: "Building" },
    { value: "condition", label: "Condition" },
    { value: "assetClass", label: "Asset Class" },
    { value: "deviceType", label: "Device Type" },
    { value: "auditStatus", label: "Audit Status" },
    { value: "permission", label: "Permission" }
  ];

  const listConfig = {
    department: {
      data: [
        { id: 1, name: "School of Computing", abbreviation: "SOC" },
        { id: 2, name: "Computer Science", abbreviation: "CS" },
        { id: 3, name: "Cyber Security and Network Management", abbreviation: "NET" },
        { id: 4, name: "Web and User Experience", abbreviation: "WEB" }
      ],
      columns: [
        { key: "name", label: "Department", type: "text" },
        { key: "abbreviation", label: "Abbreviation", type: "text" },
        {
          key: "edit",
          label: "Edit",
          type: "icon",
          icon: "edit",
          width: "50px"
        }
      ]
    },
    building: {
      data: [
        { id: 1, name: "Science and Technology", abbreviation: "NB" },
        { id: 2, name: "Elizabeth Hall", abbreviation: "EH" },
        { id: 3, name: "Engineering Technology", abbreviation: "ET" },
        { id: 4, name: "Davis Building 2", abbreviation: "D2" },
        { id: 1, name: "Davis Building 3", abbreviation: "D3" },
        { id: 2, name: "Davis Automotive", abbreviation: "DA" },
        { id: 3, name: "Marriot Building", abbreviation: "MB" },
        { id: 4, name: "Hurst Building", abbreviation: "HB" },
        { id: 3, name: "Hurst Center", abbreviation: "HC" },
        { id: 4, name: "Other", abbreviation: "OTH" }
      ],
      columns: [
        { key: "name", label: "Department", type: "text" },
        { key: "abbreviation", label: "Abbreviation", type: "text" },
        {
          key: "edit",
          label: "Edit",
          type: "icon",
          icon: "edit",
          width: "50px"
        },
        {
          key: "add",
          label: "Add",
          type: "icon",
          icon: "plus",
          width: "50px",
          action: () => alert("add room")
        }
      ]
    }
  };

  // @ts-ignore
  const getColumns = () => listConfig[activeList]?.columns || [];
  // @ts-ignore
  const getData = () => listConfig[activeList]?.data || [];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "250px",
          height: "100%",
          backgroundColor: "#0D1012",
          padding: "20px",
          borderLeft: "1px solid #b7b7b7",
          borderRight: "1px solid #b7b7b7"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Select Editable List</h2>
        <SingleSelect
          options={listOptions}
          value={activeList}
          onChange={(value) => setActiveList(value)}
          placeholder="Select a list"
          width="100%"
        />
      </div>
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Edit {activeList.charAt(0).toUpperCase() + activeList.slice(1)} List</h1>
        <div style={{ width: "50%", margin: "auto" }}>
          <Table columns={getColumns()} data={getData()} />
          <br></br>
          <button>Add {activeList.charAt(0).toUpperCase() + activeList.slice(1)}</button>
        </div>
      </div>
    </div>
  );
}
