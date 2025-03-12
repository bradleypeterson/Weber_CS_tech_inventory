import { Check } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "../../elements/Button/Button";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { IconButton } from "../../elements/IconButton/IconButton";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { TextArea } from "../../elements/TextArea/TextArea";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./UserDetailsDashboard.module.css";

type Data = {
  w_number: string;
  departments: string;
  location: string;
  firstName: string;
  lastName: string;
};

export function UserDetailsDashboard() {
  const [searchParams] = useSearchParams();
  const wNumber = useMemo(() => searchParams.get("w_number"), [searchParams]);
  const userName = "Sally Student"; //useMemo(() => searchParams.get("name"), [searchParams]);
  if (wNumber !== null && userName !== null)
    return <UserDetailsView wNumber={wNumber} userName={userName} />;
  else
    return <EmptyUserDetailsView />;
}

function UserDetailsView({ wNumber, userName }: { wNumber: string, userName: string }) {
  const linkTo = useLinkTo();
  const [formData, setFormData] = useState<Data>({
    w_number: wNumber,
    departments: "CS",
    location: "NB 324A",
    firstName: "Sally",
    lastName: "Student",
  });

  function handleInputChange(
    name: keyof Data,
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

  const formStructureFiltered = formStructure.filter(column => column.title !== "Password");

  return (
    <main className={styles.layout}>
      <div className={styles.row}>
        <div>
          <h2>Edit User Details</h2>
          <p> {userName} | {wNumber}</p>
        </div>
        <IconButton icon={<Check />} variant="secondary" />
      </div>
      <form className={styles.inputFieldContainer} onSubmit={handleSubmit}>
        {formStructureFiltered.map((column) => (
          <div key={column.title} className={styles.formColumn}>
            <h3>{column.title}</h3>
            {column.inputs.map((input) => (
              <FormField
                key={input.name}
                input={input}
                value={formData[input.name as keyof Data] || ""}
                onChange={(val) => handleInputChange(input.name as keyof Data, val)}
              />
            ))}
          </div>
        ))}
      </form>
      <div className={styles.Button}>
          <Button style={{ width: "200px" }} variant={"secondary"} onClick={() => linkTo("Change Password", ["Admin", "Users"], "w_number=W01234567")}>Change User Password</Button>
      </div>
    </main>
  );
}

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
        <IconButton icon={<Check />} variant="secondary" />
      </div>
      <form className={styles.inputFieldContainer} onSubmit={handleSubmit}>
        {formStructureWithPassword.map((column) => (
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
    </main>
  );
}

function FormField({
  input,
  value,
  onChange
}: {
  input: UserInputField;
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
      {input.inputType !== "checkbox" && (<label>{input.label}</label>)}

      {input.inputType === "input" && (
        <LabelInput
          value={typeof value === "string" || typeof value === "number" ? value : ""}
          onChange={(val) => onChange(val)}
        />
      )}

      {input.inputType === "textarea" && (
        <TextArea value={typeof value === "string" ? value : ""} onChange={(val) => onChange(val)} />
      )}

      {input.inputType === "checkbox" && <Checkbox checked={Boolean(value)} label={input.label} onChange={(val) => onChange(val)} />}

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
      { name: "firstName", label: "First Name", inputType: "input" },
      { name: "lastName", label: "Last Name", inputType: "input" },
      { name: "w_number", label: "W Number", inputType: "input" },
      {
        name: "departments",
        label: "Departments",
        inputType: "multi select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "CS" }]), 500))
      },
      {
        name: "location",
        label: "Location",
        inputType: "single select",
        fetchOptions: () => new Promise((res) => setTimeout(() => res([{ value: 1, label: "NB 324A" }]), 500))
      },
    ]
  },
  {
    title: "Permissions",
    inputs: [
      { name: "addEditAssets", label: "Add/Edit Assets", inputType: "checkbox" },
      { name: "archiveAssets", label: "Archive Assets", inputType: "checkbox" },
      { name: "csvImportExport", label: "Import/Export CSV Data", inputType: "checkbox" },
      { name: "AddEditContacts", label: "Add/Edit Contact Persons", inputType: "checkbox" },
      { name: "addEditLists", label: "Add/Edit List Options", inputType: "checkbox" },
      { name: "addEditViewUsers", label: "Add/Edit/View Users", inputType: "checkbox" },
      { name: "setUserPermissions", label: "Set User Permissions", inputType: "checkbox" },
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
