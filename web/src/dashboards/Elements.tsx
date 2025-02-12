import { useState } from "react";
import { SingleSelect } from "../elements/SingleSelect/SingleSelect";

export function Elements() {
  const [selectedValue, setSelectedValue] = useState(3);
  return (
    <div style={{ margin: "1rem" }}>
      <SingleSelect
        options={selectOptions}
        placeholder="department"
        width={"220px"}
        onChange={(val) => setSelectedValue(Number(val))}
        value={selectedValue}
      />
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
