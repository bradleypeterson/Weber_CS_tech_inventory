import { Briefcase, MagnifyingGlass } from "@phosphor-icons/react";
import { JSONSchemaType } from "ajv";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { ajv } from "../../ajv";
import { get } from "../../api/helpers";
import { Column, DynamicTable } from "../../elements/DynamicTable/DynamicTable";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { useFilters } from "../../filters/useFilters";
import { useAuth } from "../../hooks/useAuth";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AuditHistoryDashboard.module.css";

type Data = {
  auditId: number;
  date: string;
  building: string;
  room: string;
  auditor: string;
  itemsMissing: boolean;
};

interface ApiResponse {
  status: string;
  data: Data[];
}

const auditHistorySchema: JSONSchemaType<Data[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      auditId: { type: "number" },
      date: { type: "string" },
      building: { type: "string" },
      room: { type: "string" },
      auditor: { type: "string" },
      itemsMissing: { type: "boolean" }
    },
    required: ["auditId", "date", "building", "room", "auditor", "itemsMissing"]
  }
};

const validateAuditHistory = ajv.compile(auditHistorySchema);

function BuildColumns(linkTo: ReturnType<typeof useLinkTo>) {
  const columns: Column<Data>[] = [
    {
      label: "",
      render: (record: Data) => (
        <IconButton
          onClick={() => linkTo("Details", ["Audits", "History"], `audit_id=${record.auditId}`)}
          icon={<Briefcase />}
          variant="secondary"
          style={{ color: "var(--secondary-background)" }}
        />
      )
    },
    {
      dataIndex: "date",
      label: "Date"
    },
    {
      dataIndex: "building",
      label: "Building"
    },
    {
      dataIndex: "room",
      label: "Room"
    },
    {
      dataIndex: "auditor",
      label: "Auditor"
    },
    {
      dataIndex: "itemsMissing",
      label: "Items Missing",
      render: (record: Data) => record.itemsMissing ? "Yes" : "No"
    }
  ];

  return columns;
}

export function AuditHistoryDashboard() {
  const linkTo = useLinkTo();
  const { permissions } = useAuth();
  const { filters } = useFilters();
  const [searchText, setSearchText] = useState("");

  const { data: auditHistory, isLoading, error } = useQuery<ApiResponse>(
    "auditHistory",
    async () => {
      const response = await get("/audits/history", validateAuditHistory);
      if (response.status === "error") {
        throw new Error(response.error.message);
      }
      return response;
    }
  );

  const filteredData = useMemo(
    () => {
      if (!auditHistory?.data) return [];
      
      return auditHistory.data
        .filter((row) => {
          const selectedDate = filters.Date?.[0];
          const rowDate = new Date(row.date).toISOString().split('T')[0];
          const dateMatch = !selectedDate || rowDate === selectedDate;
          
          const buildingId = parseInt(row.building, 10);
          const roomId = parseInt(row.room, 10);
          const buildingMatch = !filters.Building?.length || (buildingId && filters.Building.includes(buildingId));
          const roomMatch = !filters.Room?.length || (roomId && filters.Room.includes(roomId));
          const auditorMatch = !filters.Auditor?.length || row.auditor === "Matt Western"; // Temporary fix until we get auditor IDs
          const statusMatch = !filters.Status?.length || filters.Status[0] === row.itemsMissing.toString();
          
          return dateMatch && buildingMatch && roomMatch && auditorMatch && statusMatch;
        })
        .filter((row) => 
          Object.values(row).some((value) => 
            value.toString().toLowerCase().includes(searchText)
          )
        );
    },
    [searchText, auditHistory, filters]
  );

  if (!permissions.includes(1)) {
    return (
      <main className={styles.layout}>
        <div className={styles.row}>
          <div style={{ color: "red" }}>You do not have permission to view audit history.</div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading audit history: {(error as Error).message}</div>;
  }

  return (
    <main className={styles.layout}>
      <div className={styles.header}>
        <h2>Audit History</h2>
      </div>
      <div className={styles.searchContainer}>
        <IconInput
          icon={<MagnifyingGlass />}
          width="200px"
          placeholder="search"
          value={searchText}
          onChange={(val) => setSearchText(val.toLowerCase())}
        />
      </div>
      <DynamicTable columns={BuildColumns(linkTo)} data={filteredData} width="100%" />
    </main>
  );
}
