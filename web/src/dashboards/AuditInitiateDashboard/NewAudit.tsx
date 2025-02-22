import { useState } from "react";
import { Notes } from "../../components/Notes/Notes";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { Column, Table } from "../../elements/Table/Tables";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./NewAudit.module.css";

export function NewAudit() {
  const [department, setDepartment] = useState("");
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const linkTo = useLinkTo();
  
  return (
    <main className={styles.layout}>
      <div className={styles.selectors}>
        <SingleSelect
          options={[
            { value: "cs", label: "Computer Science" },
          ]}
          value={department}
          onChange={setDepartment}
          placeholder="Department"
        />
        <SingleSelect
          options={[
            { value: "nb", label: "NB" },
          ]}
          value={building}
          onChange={setBuilding}
          placeholder="Building"
        />
        <SingleSelect
          options={[
            { value: "311", label: "311" },
          ]}
          value={room}
          onChange={setRoom}
          placeholder="Room"
        />
      </div>

      <Table columns={columns} data={dummyData} />

      <Notes notes={[]} />

      <div className={styles.buttons}>
        <button 
          className={styles.cancelButton}
          onClick={() => linkTo("Initiate Audit", ["Audits"])}
        >
          Cancel
        </button>
        <button 
          className={styles.submitButton}
          onClick={() => linkTo("Audit Summary", ["Audits", "Initiate Audit"])}
        >
          Submit
        </button>
      </div>
    </main>
  );
}

const columns: Column[] = [
  {
    label: "",
    key: "checkbox",
    type: "icon",
    width: "40px"
  },
  {
    label: "Tag Number",
    key: "tag_number",
    type: "text"
  },
  {
    label: "Department",
    key: "department",
    type: "text"
  },
  {
    label: "Asset Class",
    key: "asset_class",
    type: "text"
  },
  {
    label: "Device Type",
    key: "device_type",
    type: "text"
  },
  {
    label: "Contact Person",
    key: "contact_person",
    type: "text"
  },
  {
    label: "Status",
    key: "status",
    type: "dropdown",
    options: [
      { value: "present", label: "Present" },
      { value: "missing", label: "Missing" },
      { value: "wrong_location", label: "Wrong Location" }
    ]
  }
];

const dummyData = [
  {
    tag_number: "10062070",
    department: "Computer Science",
    asset_class: "PRINTERS",
    device_type: "Printer",
    contact_person: "Brad Petersen",
    status: "pick status"
  },
  {
    tag_number: "10062071",
    department: "Computer Science",
    asset_class: "COMPUTERS",
    device_type: "Desktop",
    contact_person: "Brad Petersen",
    status: "pick status"
  },
  {
    tag_number: "10062072",
    department: "Computer Science",
    asset_class: "MONITORS",
    device_type: "Monitor",
    contact_person: "Brad Petersen",
    status: "pick status"
  },
  {
    tag_number: "10062073",
    department: "Computer Science",
    asset_class: "NETWORKING",
    device_type: "Switch",
    contact_person: "Brad Petersen",
    status: "pick status"
  },
  {
    tag_number: "10062074",
    department: "Computer Science",
    asset_class: "TABLETS",
    device_type: "iPad",
    contact_person: "Brad Petersen",
    status: "pick status"
  },
  {
    tag_number: "10062075",
    department: "Computer Science",
    asset_class: "SERVERS",
    device_type: "Rack Server",
    contact_person: "Brad Petersen",
    status: "pick status"
  }
];