import { Check } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  AssetClass,
  Building,
  Condition,
  ContactOverview,
  Department,
  DeviceType,
  FiscalYear,
  Room
} from "../../../../@types/data";
import { addAsset } from "../../api/assets";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { IconButton } from "../../elements/IconButton/IconButton";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { TextArea } from "../../elements/TextArea/TextArea";
import {
  useAssetClasses,
  useBuildings,
  useConditions,
  useContactPersons,
  useDepartments,
  useDeviceTypes,
  useFiscalYears,
  useRooms
} from "../../hooks/optionHooks";
import styles from "./AssetsAddDashboard.module.css";

export function AssetsAddDashboard() {
  const { data: buildings, isLoading: buildingsLoading } = useBuildings();
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const { data: contactPersons, isLoading: contactPersonsLoading } = useContactPersons();
  const { data: conditions, isLoading: conditionsLoading } = useConditions();
  const { data: deviceTypes, isLoading: deviceTypesLoading } = useDeviceTypes();
  const { data: fiscalYears, isLoading: fiscalYearsLoading } = useFiscalYears();
  const { data: assetClasses, isLoading: assetClassesLoading } = useAssetClasses();

  if (
    buildingsLoading ||
    roomsLoading ||
    departmentsLoading ||
    contactPersonsLoading ||
    conditionsLoading ||
    deviceTypesLoading ||
    fiscalYearsLoading ||
    assetClassesLoading
  )
    return <>Loading...</>;

  if (
    buildings === undefined ||
    rooms === undefined ||
    departments === undefined ||
    contactPersons === undefined ||
    conditions === undefined ||
    deviceTypes === undefined ||
    fiscalYears === undefined ||
    assetClasses === undefined
  )
    return <>Error</>;

  const props = {
    buildings,
    rooms,
    departments,
    contactPersons,
    conditions,
    deviceTypes,
    fiscalYears,
    assetClasses
  };
  return <AssetDetailsView {...props} />;
}

type DetailsViewProps = {
  buildings: Building[];
  rooms: Room[];
  departments: Department[];
  contactPersons: ContactOverview[];
  conditions: Condition[];
  deviceTypes: DeviceType[];
  fiscalYears: FiscalYear[];
  assetClasses: AssetClass[];
};

function AssetDetailsView(props: DetailsViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<
    Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
  >({});

  function handleInputChange(
    name: string,
    value: string | string[] | (string | number)[] | number[] | boolean | number | null
  ) {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit() {
    try {
      setIsSaving(true);
      const response = await addAsset(formData);
      if (response.status === "error") setError(response.error.message);
      else setError("");
    } catch (e) {
      setError("An unknown error occcurred while adding the asset");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  }

  const saveDisabled = useMemo(
    () =>
      ![
        "TagNumber",
        "SecondaryNumber",
        "DepartmentID",
        "ConditionID",
        "BuildingID",
        "SerialNumber",
        "AssetClassID"
      ].every((key) => Object.keys(formData).includes(key)),
    [formData]
  );

  const formStructure = useMemo(
    () => buildFormStructure({ ...props, selectedBuildingID: Number(formData["BuildingID"]) }),
    [props, formData]
  );

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>Add Asset</h2>
        </div>
        {isSaving && <>Saving...</>}
        {error && <span style={{ color: "red" }}>{error}</span>}
        <IconButton icon={<Check />} variant="primary" onClick={handleSubmit} disabled={saveDisabled} />
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
                disabled={isSaving}
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
  onChange,
  disabled
}: {
  input: AssetInputField;
  value: string | string[] | (string | number)[] | number[] | boolean | number | null;
  onChange: (val: string | string[] | (string | number)[] | number[] | boolean | number | null) => void;
  disabled: boolean;
}) {
  const [options, setOptions] = useState<{ label: string; value: string | number }[]>([]);

  useEffect(() => {
    if (input.fetchOptions) {
      setOptions(input.fetchOptions());
    }
  }, [input]);

  return (
    <div className={styles.formField}>
      <label>{input.label}</label>

      {input.inputType === "input" && (
        <LabelInput
          value={typeof value === "string" || typeof value === "number" ? value : ""}
          onChange={(val) => onChange(typeof value === "string" ? val : Number(val))}
          disabled={disabled}
        />
      )}

      {input.inputType === "textarea" && (
        <TextArea
          value={typeof value === "string" ? value : ""}
          onChange={(val) => onChange(val)}
          disabled={disabled}
        />
      )}

      {input.inputType === "checkbox" && (
        <Checkbox checked={Boolean(value)} onChange={(val) => onChange(val ? 1 : 0)} disabled={disabled} />
      )}

      {input.inputType === "single select" && (
        <SingleSelect
          options={options}
          value={typeof value === "boolean" ? undefined : (value as string)}
          onChange={(val) => onChange(val)}
          disabled={disabled}
        />
      )}

      {input.inputType === "multi select" && (
        <MultiSelect
          options={options}
          values={Array.isArray(value) ? value : []}
          onChange={(selectedValues) => onChange(selectedValues)}
          disabled={disabled}
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
  fetchOptions?: () => { value: string | number; label: string }[];
};

type Column = {
  title: string;
  inputs: AssetInputField[];
};

function buildFormStructure(details: DetailsViewProps & { selectedBuildingID?: number }) {
  const formStructure: Column[] = [
    {
      title: "Basic Info",
      inputs: [
        { name: "TagNumber", label: "Tag Number", inputType: "input" },
        { name: "SecondaryNumber", label: "Secondary Number", inputType: "input" },
        { name: "Description", label: "Description", inputType: "textarea" },
        {
          name: "DepartmentID",
          label: "Department",
          inputType: "single select",
          fetchOptions: () =>
            details.departments.map((department) => ({ label: department.Name, value: department.DepartmentID }))
        },
        {
          name: "BuildingID",
          label: "Building",
          inputType: "single select",
          fetchOptions: () =>
            details.buildings.map((building) => ({ label: building.Name, value: building.BuildingID }))
        },
        {
          name: "LocationID",
          label: "Room",
          inputType: "single select",
          fetchOptions: () =>
            details.rooms
              .filter((room) => room.BuildingID === details.selectedBuildingID)
              .map((room) => ({ label: room.RoomNumber, value: room.LocationID }))
        },
        {
          name: "ContactPersonID",
          label: "Contact Person",
          inputType: "single select",
          fetchOptions: () =>
            details.contactPersons.map((person) => ({ label: person.FullName, value: person.PersonID }))
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
          fetchOptions: () => details.deviceTypes.map((type) => ({ label: type.Name, value: type.DeviceTypeID }))
        },
        {
          name: "AssetClassID",
          label: "Asset Class",
          inputType: "single select",
          fetchOptions: () => details.assetClasses.map((type) => ({ label: type.Name, value: type.AssetClassID }))
        },
        { name: "SerialNumber", label: "Serial Number", inputType: "input" },
        {
          name: "ConditionID",
          label: "Condition",
          inputType: "single select",
          fetchOptions: () =>
            details.conditions.map((condition) => ({ label: condition.ConditionName, value: condition.ConditionID }))
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
        {
          name: "FiscalYearID",
          label: "Replacement Fiscal Year",
          inputType: "single select",
          fetchOptions: () => details.fiscalYears.map((year) => ({ label: year.Year, value: year.ReplacementID }))
        }
      ]
    }
  ];

  return formStructure;
}
