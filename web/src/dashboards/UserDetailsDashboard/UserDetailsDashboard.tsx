import { Check, Pencil } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router";
import { fetchUserDetails, updateUserDetails } from "../../api/users";
import { Button } from "../../elements/Button/Button";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { IconButton } from "../../elements/IconButton/IconButton";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { TextArea } from "../../elements/TextArea/TextArea";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./UserDetailsDashboard.module.css";

export function UserDetailsDashboard() {
  const [searchParams] = useSearchParams();
  const personID = useMemo(() => searchParams.get("personID"), [searchParams]);
  
  if (personID !== null)
    return <UserDetailsView personID={personID} />;
  
  return <EmptyUserDetailsView />;
}

function UserDetailsView({ personID }: { personID: string }) {
  const linkTo = useLinkTo();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const {
    data: userDetails,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["User Details", personID],
    queryFn: () => fetchUserDetails(Number(personID))
  });

  const [formData, setFormData] = useState<
    Record<string, string | string[] | (string | number)[] | number[] | boolean | number | null>
  >({});

  useEffect(
    function syncUserDetails() {
      if (userDetails === undefined) return;
      if (Object.keys(formData).length > 0) return;
      setFormData(userDetails);
    },
    [userDetails, formData]
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
     if (userDetails === undefined) changedFields = formData;
     else changedFields = getChangedFields(userDetails, formData);
     if (Object.keys(changedFields).length === 0) {
       setIsEditing(false);
       return;
     }
 
     setIsSaving(true);
     if (!(await updateUserDetails(Number(personID), changedFields)))
       setError("An error occurred while updating this user");
     else {
       setError("");
       setIsEditing(false);
     }
 
     setIsSaving(false);
   }
 
   if (isLoading) return <>Loading</>;
   if (isError) return <>Unknown User</>;

  const formStructureFiltered = formStructure.filter(column => column.title !== "Password");
  
  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>User Details</h2>
          <p> {userDetails?.Name} | {userDetails?.WNumber}</p>
        </div>
        {isSaving && <>Saving...</>}
        {error && <span style={{ color: "red" }}>{error}</span>}
        {!isEditing && <IconButton icon={<Pencil />} variant="secondary" onClick={() => setIsEditing(true)} />}
        {isEditing && <IconButton icon={<Check />} variant="primary" onClick={handleSubmit} />} 
      </div>
      <form className={styles.inputFieldContainer}>
        {formStructureFiltered.map((column) => (
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
      <div className={styles.Button}>
          <Button style={{ width: "200px" }} variant={"secondary"} onClick={() => linkTo("Change Password", ["Admin", "Users"], "personID=personID")}>Change User Password</Button>
      </div>
    </main>
  );
}

//TODO: Finish for adding new user
function EmptyUserDetailsView() {
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

  const formStructureWithPassword = formStructure;

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>New User Details</h2>
        </div>
        <IconButton icon={<Check />} variant="secondary" onClick={handleSubmit} />
      </div>
      <form className={styles.inputFieldContainer}>
        {formStructureWithPassword.map((column) => (
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
  input: UserInputField;
  value: string | string[] | (string | number)[] | number[] | boolean | number;
  onChange: (val: string | string[] | (string | number)[] | number[] | boolean | number) => void;
  disabled: boolean;
}) {
  const [options, setOptions] = useState<{ label: string; value: string | number }[]>([]);

  useEffect(() => {
    if (input.fetchOptions) {
      input.fetchOptions().then(setOptions);
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

type UserInputField = {
  name: string; // Unique identifier for form handling
  label: string;
  inputType: InputType;
  fetchOptions?: () => Promise<{ value: string | number; label: string }[]>; // Only used for select inputs
};

type Column = {
  title: string;
  inputs: UserInputField[];
};

const formStructure: Column[] = [
  {
    title: "User Info",
    inputs: [
      { name: "FirstName", label: "First Name", inputType: "input" },
      { name: "LastName", label: "Last Name", inputType: "input" },
      { name: "WNumber", label: "W Number", inputType: "input" },
      {
        name: "Departments",
        label: "Departments",
        inputType: "multi select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "CS" }]), 500))
      },
      {
        name: "Building",
        label: "Building",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "remote" }]), 500))
      },
      {
        name: "RoomNumber",
        label: "RoomNumber",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "remote" }]), 500))
      },
    ]
  },
  {
    title: "Permissions",
    inputs: [
      { name: "Add/Edit Assets", label: "Add/Edit Assets", inputType: "checkbox" },
      { name: "Archive Assets", label: "Archive Assets", inputType: "checkbox" },
      { name: "Import/Export CSV Data", label: "Import/Export CSV Data", inputType: "checkbox" },
      { name: "Add/Edit Contact Persons", label: "Add/Edit Contact Persons", inputType: "checkbox" },
      { name: "Add/Edit List Options", label: "Add/Edit List Options", inputType: "checkbox" },
      { name: "Add/Edit/View Users", label: "Add/Edit/View Users", inputType: "checkbox" },
      { name: "Set User Permissions", label: "Set User Permissions", inputType: "checkbox" },
    ]
  },
  {
    title: "Password",
    inputs: [
      { name: "newPassword", label: "New Password", inputType: "input" },
      { name: "confirmNewPassword", label: "Confirm New Password", inputType: "input" },
      { name: "passwordsMatch", label: "Passwords Match", inputType: "checkbox" },
      { name: "sixteenChars", label: "At Least 16 Characters", inputType: "checkbox" },
      { name: "number", label: "At Least One Number", inputType: "checkbox" },
      { name: "uppercase", label: "At Least One Uppercase Letter", inputType: "checkbox" },
      { name: "lowercase", label: "At Least One Lowercase Letter", inputType: "checkbox" },
    ]
  },
];
