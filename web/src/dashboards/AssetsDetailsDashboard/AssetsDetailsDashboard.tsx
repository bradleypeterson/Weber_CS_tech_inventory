import { ArrowRight, Barcode, Check, Pencil } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router";
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
import { addNewNote, fetchAssetDetails, fetchAssetNotes, updateAssetDetails } from "../../api/assets";
import { Notes } from "../../components/Notes/Notes";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
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
import { useAuth } from "../../hooks/useAuth";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AssetsDetailsDashboard.module.css";

export function AssetsDetailsDashboard() {
  const [tagId, setTagId] = useState("");
  const linkTo = useLinkTo();
  const [searchParams] = useSearchParams();
  const assetId = useMemo(() => searchParams.get("assetId"), [searchParams]);
  const { data: buildings, isLoading: buildingsLoading } = useBuildings();
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const { data: contactPersons, isLoading: contactPersonsLoading } = useContactPersons();
  const { data: conditions, isLoading: conditionsLoading } = useConditions();
  const { data: deviceTypes, isLoading: deviceTypesLoading } = useDeviceTypes();
  const { data: fiscalYears, isLoading: fiscalYearsLoading } = useFiscalYears();
  const { data: assetClasses, isLoading: assetClassesLoading } = useAssetClasses();

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
    assetId,
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
  assetId: string;
  buildings: Building[];
  rooms: Room[];
  departments: Department[];
  contactPersons: ContactOverview[];
  conditions: Condition[];
  deviceTypes: DeviceType[];
  fiscalYears: FiscalYear[];
  assetClasses: AssetClass[];
};

function AssetDetailsView({ assetId, ...props }: DetailsViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const {
    data: assetDetails,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["Asset Details", assetId],
    queryFn: () => fetchAssetDetails(Number(assetId))
  });
  const { data: notes, refetch: refetchNotes } = useQuery({
    queryKey: ["Notes", assetId],
    queryFn: () => fetchAssetNotes(Number(assetId))
  });
  const { permissions } = useAuth();

  const [formData, setFormData] = useState<
    Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
  >({});

  useEffect(
    function syncAssetDetails() {
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

  async function handleSubmit() {
    let changedFields: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>;
    if (assetDetails === undefined) changedFields = formData;
    else changedFields = getChangedFields(assetDetails, formData);
    if (Object.keys(changedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    if (!(await updateAssetDetails(Number(assetId), changedFields)))
      setError("An error occurred while updating this asset");
    else {
      setError("");
      setIsEditing(false);
    }

    setIsSaving(false);
  }

  async function handleAddNote(note: string) {
    await addNewNote(Number(assetId), note);
    refetchNotes();
  }

  const formStructure = useMemo(
    () => buildFormStructure({ assetId, ...props, selectedBuildingID: Number(formData["BuildingID"]) }),
    [props, assetId, formData]
  );

  if (isLoading) return <>Loading</>;
  if (isError) return <>Unknown Asset</>;

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>Asset Details</h2>
          <p>#{assetId}</p>
        </div>
        {isSaving && <>Saving...</>}
        {error && <span style={{ color: "red" }}>{error}</span>}
        {permissions.includes(1) && !isEditing && (
          <IconButton icon={<Pencil />} variant="secondary" onClick={() => setIsEditing(true)} />
        )}
        {permissions.includes(1) && isEditing && (
          <IconButton icon={<Check />} variant="primary" onClick={handleSubmit} />
        )}
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
                disabled={!isEditing}
              />
            ))}
          </div>
        ))}
      </form>
      <Notes notes={notes?.map((note) => note.Note) ?? []} onAdd={handleAddNote} />
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

function getChangedFields(
  original: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>,
  updated: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
) {
  const changedFields: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null> =
    {};

  for (const key in updated) {
    if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
      changedFields[key] = updated[key];
    }
  }

  return changedFields;
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
