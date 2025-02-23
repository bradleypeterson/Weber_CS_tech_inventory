import { ArrowRight, Barcode } from "@phosphor-icons/react";
import { useState } from "react";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
// import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AuditInitiateDashboard.module.css";

export function AuditInitiateDashboard() {
  // const [department, setDepartment] = useState<string>("");
  const [barcode, setBarcode] = useState("");
  const linkTo = useLinkTo();

  return (
    <main className={styles.layout}>
      <h1>Room Audit</h1>
      
      {/* might not need department select here */}
      {/* <div className={styles.departmentSelect}> 
        <SingleSelect
          options={[
            { value: "cs", label: "School of Computing" }, // value is probably wrong
            // Add more departments as needed or get from database
          ]}
          value={department}
          onChange={(value) => setDepartment(value)}
          placeholder="Department"
        />
      </div> */}

      <div className={styles.scanSection}>
        <IconInput
          placeholder="Scan Barcode to Begin Audit"
          icon={<Barcode />}
          width="350px"
          value={barcode}
          onChange={(value) => setBarcode(value)}
          autoFocus
        />
        <IconButton
          icon={<ArrowRight />}
          variant="primary"
          disabled={barcode === ""}
          onClick={() => linkTo("New Audit", ["Audits", "Initiate Audit"], `room_id=${barcode}`)}
        />
      </div>
    </main>
  );
}
