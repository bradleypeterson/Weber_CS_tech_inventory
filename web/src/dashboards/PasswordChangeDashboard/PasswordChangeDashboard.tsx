import { useEffect, useState } from "react";
//import { useSearchParams } from "react-router";
import { Button } from "../../elements/Button/Button";
import { Checkbox } from "../../elements/Checkbox/Checkbox";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { MultiSelect } from "../../elements/MultiSelect/MultiSelect";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { TextArea } from "../../elements/TextArea/TextArea";
import styles from "./PasswordChangeDashboard.module.css";

export function PasswordChangeDashboard() {
  //const [searchParams] = useSearchParams();
  const wNumber = "W01234567"; //useMemo(() => searchParams.get("w_number"), [searchParams]);
  const userName = "Sally Student"; //useMemo(() => searchParams.get("name"), [searchParams]);
  if (wNumber !== null && userName !== null)
    return <PasswordChangeView wNumber={wNumber} userName={userName} />;
}

function PasswordChangeView({ wNumber, userName }: { wNumber: string, userName: string }) {
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
          <h2>Change User Password</h2>
          <p> {userName} | {wNumber}</p>
        </div>
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
      <div className={styles.Button}>
        <Button style={{ width: "200px" }} variant={"secondary"}>Change User Password</Button>
      </div>
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
    title: "",
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