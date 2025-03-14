import { ArrowRight, Barcode, Pencil } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router";
import { fetchAssetDetails } from "../../api/assets";
import { Notes } from "../../components/Notes/Notes";
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
  const assetId = useMemo(() => searchParams.get("assetId"), [searchParams]);

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
              autoFocus
            />
            <IconButton
              icon={<ArrowRight />}
              onClick={() => linkTo("Asset Details", ["Assets"], `assetId=${tagId}`)}
              variant="primary"
              disabled={tagId === ""}
            />
          </div>
          <a onClick={() => linkTo("Search", ["Assets"])}>Search an asset</a>
        </div>
      </main>
    );

  return <AssetDetailsView assetId={assetId} />;
}

function AssetDetailsView({ assetId }: { assetId: string }) {
  const { data: assetDetails, isLoading } = useQuery({
    queryKey: ["Asset Details", assetId],
    queryFn: () => fetchAssetDetails(Number(assetId))
  });

  const [formData, setFormData] = useState<
    Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
  >({});

  useEffect(
    function syncAssetDetails() {
      console.log(assetDetails);
      if (assetDetails === undefined) return;
      if (Object.keys(formData).length > 0) return;
      setFormData(assetDetails);
    },
    [assetDetails, formData]
  );

  function handleInputChange(
    name: string,
    value: string | string[] | (string | number)[] | number[] | boolean | number | null
  ) {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit() {
    console.log("SUBMIT");
  }

  if (isLoading) return <>Loading</>;

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>Asset Details</h2>
          <p>#{assetId}</p>
        </div>
        <IconButton icon={<Pencil />} variant="secondary" />
      </div>
      <form className={styles.inputFieldContainer} onSubmit={handleSubmit}>
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
  value: string | string[] | (string | number)[] | number[] | boolean | number | null;
  onChange: (val: string | string[] | (string | number)[] | number[] | boolean | number | null) => void;
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
      { name: "TagNumber", label: "Tag Number", inputType: "input" },
      { name: "SecondaryNumber", label: "Secondary Number", inputType: "input" },
      { name: "Description", label: "Description", inputType: "textarea" },
      {
        name: "Department",
        label: "Department",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "Web" }]), 500))
      },
      {
        name: "Building",
        label: "Building",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "NB" }]), 500))
      },
      {
        name: "Room",
        label: "Room",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "102NB" }]), 500))
      },
      {
        name: "ContactPerson",
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
        name: "DeviceTypeID",
        label: "Device Type",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 7, label: "Printer" }]), 500))
      },
      { name: "SerialNumber", label: "Serial Number", inputType: "input" },
      {
        name: "ConditionID",
        label: "Condition",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "Good" }]), 500))
      },
      { name: "Manufacturer", label: "Manufacturer", inputType: "input" },
      { name: "PartNumber", label: "Part Number", inputType: "input" },
      { name: "Rapid7", label: "Rapid 7", inputType: "checkbox" },
      { name: "CrowdStrike", label: "CrowdStrike", inputType: "checkbox" }
    ]
  },
  {
    title: "Accounting Info",
    inputs: [
      { name: "AccountingDate", label: "Accounting Date", inputType: "input" },
      { name: "AccountCost", label: "Account Cost", inputType: "input" },
      { name: "PONumber", label: "PO Number", inputType: "input" },
      { name: "FiscalYear", label: "Replacement Fiscal Year", inputType: "input" }
    ]
  }
];
