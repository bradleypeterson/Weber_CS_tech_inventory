import { MagnifyingGlass } from "@phosphor-icons/react";
import { JSONSchemaType } from "ajv";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { ajv } from "../../ajv";
import { get } from "../../api/helpers";
import { Notes } from "../../components/Notes/Notes";
import { Button } from "../../elements/Button/Button";
import { Column, DynamicTable } from "../../elements/DynamicTable/DynamicTable";
import { IconInput } from "../../elements/IconInput/IconInput";
import { LabelInput } from "../../elements/LabelInput/LabelInput";
import { useAuth } from "../../hooks/useAuth";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AuditDetailsDashboard.module.css";

type Data = {
  tag_number: string;
  department: string;
  asset_class: string;
  device_type: string;
  contact_person: string;
  status: string;
  audit_time: string;
  building: string;
  room: string;
  created_by: string;
};

interface ApiResponse {
  status: string;
  data: Data[];
}

const auditDetailsSchema: JSONSchemaType<Data[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      tag_number: { type: "string" },
      department: { type: "string" },
      asset_class: { type: "string" },
      device_type: { type: "string" },
      contact_person: { type: "string" },
      status: { type: "string" },
      audit_time: { type: "string" },
      building: { type: "string" },
      room: { type: "string" },
      created_by: { type: "string" }
    },
    required: ["tag_number", "status"]
  }
};

const validateAuditDetails = ajv.compile(auditDetailsSchema);

export function AuditDetailsDashboard() {
  const { permissions } = useAuth();
  const linkTo = useLinkTo();
  const [searchParams] = useSearchParams();
  const auditId = searchParams.get("audit_id");
  const [searchText, setSearchText] = useState("");

  const { data: auditDetails, isLoading, error } = useQuery<ApiResponse>(
    ["auditDetails", auditId],
    async () => {
      if (!auditId) throw new Error("No audit ID provided");
      const response = await get(`/audits/history/${auditId}`, validateAuditDetails);
      if (response.status === "error") {
        throw new Error(response.error.message);
      }
      return response;
    },
    {
      enabled: !!auditId
    }
  );

  const filteredData = useMemo(
    () => 
      auditDetails?.data.filter((row) => 
        Object.values(row).some((value) => 
          value?.toString().toLowerCase().includes(searchText)
        )
      ) ?? [],
    [auditDetails?.data, searchText]
  );

  if (!permissions.includes(1)) {
    return (
      <main className={styles.layout}>
        <div className={styles.row}>
          <div style={{ color: "red" }}>You do not have permission to view audit details.</div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className={styles.layout}>
        <div>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.layout}>
        <div style={{ color: "red" }}>Error loading audit details: {error instanceof Error ? error.message : "Unknown error"}</div>
      </main>
    );
  }

  return (
    <main className={styles.layout}>
      <div className={styles.header}>
        <div />
        <h2>Audit Details</h2>        
      </div>

      <div className={styles.auditInfoContainer}>
        <LabelInput
          label="Date"
          value={auditDetails?.data[0]?.audit_time ? new Date(auditDetails.data[0].audit_time).toLocaleDateString() : ''}
          readOnly
          width="200px"
        />
        <LabelInput
          label="Location"
          value={auditDetails?.data[0] ? `${auditDetails.data[0].building}${auditDetails.data[0].room}` : ''}
          readOnly
          width="200px"
        />
        <LabelInput
          label="Auditor"
          value={auditDetails?.data[0]?.created_by || ''}
          readOnly
          width="200px"
        />
      </div>

      <div className={styles.controls}>
        <IconInput
          icon={<MagnifyingGlass />}
          width="200px"
          placeholder="search"
          value={searchText}
          onChange={(val) => setSearchText(val.toLowerCase())}
        />
      </div>
      <DynamicTable columns={BuildColumns()} data={filteredData} width="100%" style={{ marginTop: "1rem" }} />
      <Notes notes={[]} />
      <div className={styles.backButtonContainer}>
        <Button 
          variant="primary"
          className={styles.wideButton}
        >
          Update Notes
        </Button>
        <Button 
          variant="secondary"
          onClick={() => linkTo("History", ["Audits"])}
          className={styles.wideButton}
        >
          Back
        </Button>
      </div>
    </main>
  );
}

function BuildColumns() {
  const columns: Column<Data>[] = [
    {
      dataIndex: "tag_number",
      label: "Tag Number"
    },
    {
      dataIndex: "department",
      label: "Department"
    },
    {
      dataIndex: "asset_class",
      label: "Asset Class"
    },
    {
      dataIndex: "device_type",
      label: "Device Type"
    },
    {
      dataIndex: "contact_person",
      label: "Contact Person"
    },
    {
      dataIndex: "status",
      label: "Status"
    }
  ];

  return columns;
}
