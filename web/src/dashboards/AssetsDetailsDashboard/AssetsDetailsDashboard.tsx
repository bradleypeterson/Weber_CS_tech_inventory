import { ArrowRight, Barcode } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { TextArea } from "../../elements/TextArea/TextArea";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AssetsDetailsDashboard.module.css";

export function AssetsDetailsDashboard() {
  const [tagId, setTagId] = useState("");
  const linkTo = useLinkTo();
  const [searchParams] = useSearchParams();
  const assetId = useMemo(() => searchParams.get("asset_id"), [searchParams]);

  if (assetId === null)
    return (
      <main className={styles.noTagLayout}>
        <div>
          <h2>Enter a tag id below to get started</h2>
          <div className={styles.tagInput}>
            <IconInput
              placeholder="Enter tag id"
              icon={<Barcode />}
              width="100%"
              value={tagId}
              onChange={(value) => setTagId(value)}
            />
            <IconButton
              icon={<ArrowRight />}
              onClick={() => linkTo("Asset Details", "Assets", `asset_id=${tagId}`)}
              variant="primary"
              disabled={tagId === ""}
            />
          </div>
          <a onClick={() => linkTo("Search", "Assets")}>Search an asset</a>
        </div>
      </main>
    );

  return <AssetDetailsView assetId={assetId} />;
}

function AssetDetailsView({ assetId }: { assetId: string }) {
  console.log(assetId);
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
      <form className={styles.inputFieldContainer} onSubmit={handleSubmit}>
        {formStructure.map((column) => (
          <div key={column.title}>
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
      { name: "description", label: "Description", inputType: "textarea" }
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
      { name: "serialNumber", label: "Serial Number", inputType: "input" }
    ]
  },
  {
    title: "Acquisition Info",
    inputs: [
      { name: "acquisitionDate", label: "Acquisition Date", inputType: "input" },
      { name: "acquisitionCost", label: "Acquisition Cost", inputType: "input" }
    ]
  }
];
