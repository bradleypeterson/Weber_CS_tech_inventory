import { Check } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Notes } from "../../components/Notes/Notes";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { IconButton } from "../../elements/IconButton/IconButton";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { TextArea } from "../../elements/TextArea/TextArea";
import styles from "./AssetsAddDashboard.module.css";

export function AssetsAddDashboard() {
  const [formData, setFormData] = useState<
    Record<string, string | string[] | (string | number)[] | number[] | boolean | number>
  >({});

  function handleInputChange(
    name: string,
    value: string | string[] | (string | number)[] | number[] | boolean | number
  ) {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit() {
    console.log("SUBMIT");
  }

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>Add Asset</h2>
        </div>
        <IconButton icon={<Check />} variant="primary" onClick={handleSubmit} />
      </div>
      <form className={styles.inputFieldContainer}>
        {formStructure.map((column) => (
          <div key={column.title} className={styles.formColumn}>
            <h3>{column.title}</h3>
            {column.inputs.map((input) => (
              <FormField
                key={input.name}
                input={input}
                value={formData[input.name] || ""}
                onChange={(val) => handleInputChange(input.name, val)}
              />
            ))}
          </div>
        ))}
      </form>
      <Notes notes={[]} />
    </main>
  );
}

function FormField({
  input,
  value,
  onChange
}: {
  input: AssetInputField;
  value: string | string[] | (string | number)[] | number[] | boolean | number;
  onChange: (val: string | string[] | (string | number)[] | number[] | boolean | number) => void;
}) {
  const [options, setOptions] = useState<{ label: string; value: string | number }[]>([]);

  useEffect(() => {
    if (input.fetchOptions) {
      input.fetchOptions().then(setOptions);
    }
  }, [input]);

  return (
    <div className={styles.formField}>
      <label>{input.label}</label>

      {input.inputType === "input" && (
        <LabelInput
          value={typeof value === "string" || typeof value === "number" ? value : ""}
          onChange={(val) => onChange(val)}
        />
      )}

      {input.inputType === "textarea" && (
        <TextArea value={typeof value === "string" ? value : ""} onChange={(val) => onChange(val)} />
      )}

      {input.inputType === "checkbox" && <Checkbox checked={Boolean(value)} onChange={(val) => onChange(val)} />}

      {input.inputType === "single select" && (
        <SingleSelect
          options={options}
          value={typeof value === "boolean" ? undefined : (value as string)}
          onChange={(val) => onChange(val)}
        />
      )}

      {input.inputType === "multi select" && (
        <MultiSelect
          options={options}
          values={Array.isArray(value) ? value : []}
          onChange={(selectedValues) => onChange(selectedValues)}
        />
      )}
    </div>
  );
}

type InputType = "input" | "textarea" | "checkbox" | "single select" | "multi select";

type AssetInputField = {
  name: string; // Unique identifier for form handling
  label: string;
  inputType: InputType;
  fetchOptions?: () => Promise<{ value: string | number; label: string }[]>; // Only used for select inputs
};

type Column = {
  title: string;
  inputs: AssetInputField[];
};

const formStructure: Column[] = [
  {
    title: "Basic Info",
    inputs: [
      { name: "tagNumber", label: "Tag Number", inputType: "input" },
      { name: "secondaryNumber", label: "Secondary Number", inputType: "input" },
      { name: "description", label: "Description", inputType: "textarea" },
      {
        name: "department",
        label: "Department",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "Web" }]), 500))
      },
      {
        name: "building",
        label: "Building",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "NB" }]), 500))
      },
      {
        name: "room",
        label: "Room",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "102NB" }]), 500))
      },
      {
        name: "contactPerson",
        label: "Contact Person",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "Brad Petersen" }]), 500))
      }
    ]
  },
  {
    title: "Device Details",
    inputs: [
      {
        name: "deviceType",
        label: "Device Type",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "Printer" }]), 500))
      },
      { name: "serialNumber", label: "Serial Number", inputType: "input" },
      {
        name: "condition",
        label: "Condition",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "Good" }]), 500))
      },
      { name: "manufacturer", label: "Manufacturer", inputType: "input" },
      { name: "partNumber", label: "Part Number", inputType: "input" },
      { name: "rapid7", label: "Rapid 7", inputType: "checkbox" },
      { name: "cloudStrike", label: "Cloud Strike", inputType: "checkbox" }
    ]
  },
  {
    title: "Acquisition Info",
    inputs: [
      { name: "acquisitionDate", label: "Acquisition Date", inputType: "input" },
      { name: "acquisitionCost", label: "Acquisition Cost", inputType: "input" },
      { name: "poNumber", label: "PO Number", inputType: "input" },
      { name: "replacementFiscalYear", label: "Replacement Fiscal Year", inputType: "input" }
    ]
  }
];
