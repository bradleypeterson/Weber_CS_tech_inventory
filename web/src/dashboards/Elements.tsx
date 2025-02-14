import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";
import { IconInput } from "../elements/IconInput/IconInput";
import { LabelInput } from "../elements/LabelInput/LabelInput";
import { SingleSelect } from "../elements/SingleSelect/SingleSelect";
import { Table } from "../elements/Table/Tables";

export function Elements() {
  const [selectedValue, setSelectedValue] = useState(3);

  const columns = [
    { key: "building", label: "Building", type: "text" },
    { key: "abbreviation", label: "Abbreviation", type: "text" },
    { key: "edit", label: "Edit Building", type: "icon", icon: "edit", action: () => alert("edit building") },
    { key: "add", label: "Edit Rooms", type: "icon", icon: "plus", action: () => alert("edit rooms") },
    { key: "delete", label: "Delete Building", type: "icon", icon: "trash", action: () => alert("delete building") }
  ];

  const data = [
    { id: 1, building: "Browning Center", abbreviation: "BC" },
    { id: 2, building: "Elizabeth Hall", abbreviation: "EH" },
    { id: 3, building: "Lind Lecture Hall", abbreviation: "LL" }
  ];

  return (
    <div style={{ margin: "1rem" }}>
      <SingleSelect
        options={selectOptions}
        placeholder="department"
        width={"220px"}
        onChange={(val) => setSelectedValue(Number(val))}
        value={selectedValue}
      />
      <br></br>
      <IconInput placeholder={"Search"} width={"220px"} icon={<MagnifyingGlass />} />
      <br></br>
      <LabelInput placeholder={"Enter Name"} width={"220px"} label={"Name"} />
      <br></br>
      <Table columns={columns} data={data} />
    </div>
  );
}

const selectOptions = [
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
  { label: "Option 4", value: 4 },
  { label: "Option 5", value: 5 },
  { label: "Option 6", value: 6 },
  { label: "Option 7", value: 7 },
  { label: "Option 8", value: 8 },
  { label: "Option 9", value: 9 },
  { label: "Option 10", value: 10 },
  { label: "Long option name that should exceed the limit", value: 11 }
];
