import { Check, Pencil } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router";
import { Building, Department, Room } from "../../../../@types/data";
import { fetchContactDetails, updateContactDetails } from "../../api/contacts";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { IconButton } from "../../elements/IconButton/IconButton";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { TextArea } from "../../elements/TextArea/TextArea";
import {
  useBuildings,
  useDepartments,
  useRooms,
} from "../../hooks/optionHooks";
import styles from "./ContactDetailsDashboard.module.css";


export function ContactDetailsDashboard() {
  const [searchParams] = useSearchParams();
  const personID = useMemo(() => searchParams.get("personID"), [searchParams]);
  const { data: buildings, isLoading: buildingsLoading } = useBuildings();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const { data: rooms, isLoading: roomsLoading } = useRooms();

  if (
    buildingsLoading ||
    departmentsLoading ||
    roomsLoading
  )
    return <>Loading...</>;

  if (
    buildings === undefined ||
    departments === undefined ||
    rooms === undefined 
  )
    return <>Error</>;

  const props = {
    personID,
    buildings,
    departments,
    rooms
  };

  if (personID !== null)
    return <ContactDetailsView {...props} />;

  return <EmptyContactDetailsView {...props}/>;
}

type DetailsViewProps = {
  personID: string | null;
  buildings: Building[];
  departments: Department[];
  rooms: Room[];
};

function ContactDetailsView({...props }: DetailsViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
 
  const {
    data: contactDetails,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["Contact Details", props.personID],
    queryFn: () => fetchContactDetails(Number(props.personID))
  });

  const [formData, setFormData] = useState<
    Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
  >({});

  useEffect(
    function syncContactDetails() {
      if (contactDetails === undefined) return;
      if (Object.keys(formData).length > 0) return;
      setFormData(contactDetails);
    },
    [contactDetails, formData]
  );

  function handleInputChange(
    name: string,
    value: string | string[] | (string | number)[] | number[] | boolean | number
  ) {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit() {
    let changedFields: Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>;
    if (contactDetails === undefined) changedFields = formData;
    else changedFields = getChangedFields(contactDetails, formData);
    if (Object.keys(changedFields).length === 0) {
      setIsEditing(false);
      return;
    }
  
    setIsSaving(true);setIsSaving(true);
    if (!(await updateContactDetails(Number(props.personID), changedFields)))
      setError("An error occurred while updating this contact");
    else {
      setError("");
      setIsEditing(false);
    }

    setIsSaving(false);
  }

  const formStructure = useMemo(() => buildFormStructure({ ...props }), [props]);
  
  if (isLoading) return <>Loading</>;
  if (isError) return <>Unknown Contact</>;

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>Contact Details</h2>
          <p> {contactDetails?.Name} | {contactDetails?.WNumber}</p>
        </div>
        {isSaving && <>Saving...</>}
        {error && <span style={{ color: "red" }}>{error}</span>}
        {!isEditing && <IconButton icon={<Pencil />} variant="secondary" onClick={() => setIsEditing(true)} />}
        {isEditing && <IconButton icon={<Check />} variant="primary" onClick={handleSubmit} />} 
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
                disabled={!isEditing}
              />
            ))}
          </div>
        ))}
      </form>
    </main>
  );
}

function EmptyContactDetailsView({...props }: DetailsViewProps) {
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
  
  const formStructure = useMemo(() => buildFormStructure({ ...props }), [props]);

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>New Contact Details</h2>
        </div>
        <IconButton icon={<Check />} variant="secondary" onClick={handleSubmit} />
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
                disabled={false}
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
  input: ContactInputField;
  value: string | string[] | (string | number)[] | number[] | boolean | number;
  onChange: (val: string | string[] | (string | number)[] | number[] | boolean | number) => void;
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
       {input.inputType !== "checkbox" && (<label>{input.label}</label>)}

{input.inputType === "input" && (
  <LabelInput
    value={typeof value === "string" || typeof value === "number" ? value : ""}
    onChange={(val) => onChange(val)}
    disabled={disabled}
  />
)}

{input.inputType === "textarea" && (
  <TextArea value={typeof value === "string" ? value : ""} onChange={(val) => onChange(val)} disabled={disabled} />
)}

{input.inputType === "checkbox" && (
  <Checkbox 
    checked={Boolean(value)} 
    label={input.label} 
    onChange={(val) => onChange(val)} 
    disabled={disabled}
  />
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

type ContactInputField = {
  name: string; // Unique identifier for form handling
  label: string;
  inputType: InputType;
  fetchOptions?: () => { value: string | number; label: string }[]; // Only used for select inputs
};

type Column = {
  title: string;
  inputs: ContactInputField[];
};

function buildFormStructure(details: DetailsViewProps): Column[] {
  const formStructure: Column[] = [
    {
      title: "Contact Person Info",
      inputs: [
        { name: "FirstName", label: "First Name", inputType: "input" },
        { name: "LastName", label: "Last Name", inputType: "input" },
        { name: "WNumber", label: "W Number", inputType: "input" },
        {
          name: "Department",
          label: "Department",
          inputType: "multi select",
          fetchOptions: () => details.departments.map((department) => ({ label: department.Name, value: department.DepartmentID }))
        },
        {
          name: "Building",
          label: "Building",
          inputType: "single select",
          fetchOptions: () => details.buildings.map((building) => ({ label: building.Name, value: building.BuildingID }))
        },
        {
          name: "RoomNumber",
          label: "RoomNumber",
          inputType: "single select",
          fetchOptions: () => details.rooms.map((room) => ({ label: room.Barcode, value: room.Barcode }))
        },
      ]
    },
  ];
  return formStructure;
}