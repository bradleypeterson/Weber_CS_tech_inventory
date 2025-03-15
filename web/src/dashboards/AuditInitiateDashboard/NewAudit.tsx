import { useMemo } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import type { APIResponse } from "../../../../@types/api";
import { Notes } from "../../components/Notes/Notes";
import { Column, Table } from "../../elements/Table/Tables";
import { useFilters } from "../../filters/useFilters";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./NewAudit.module.css";

interface EquipmentDetailsRow {
  EquipmentID: number;
  TagNumber: string;
  SerialNumber: string;
  Description: string;
  DepartmentID: number;
  DepartmentName: string;
  LocationID: number;
  RoomNumber: string;
  BuildingID: number;
  BuildingName: string;
  BuildingAbbr: string;
  DeviceTypeName: string;
}

export function NewAudit() {
  const linkTo = useLinkTo();
  const { filters } = useFilters();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room_id');

  const { data: equipmentData, isLoading } = useQuery<APIResponse<EquipmentDetailsRow[]>>(
    ["equipmentInRoom", roomId],
    async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/audits/equipment/${roomId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch equipment data');
      }

      return response.json();
    },
    {
      enabled: !!roomId
    }
  );

  const filteredData = useMemo(() => {
    if (!equipmentData || equipmentData.status !== "success") return [];
    
    return equipmentData.data.filter((row: EquipmentDetailsRow) => {
      const departmentMatch = !filters.Department?.length || filters.Department.includes(row.DepartmentID);
      const buildingMatch = !filters.Building?.length || filters.Building.includes(row.BuildingID);
      const locationMatch = !filters.Room?.length || filters.Room.includes(row.LocationID);
      
      return departmentMatch && buildingMatch && locationMatch;
    });
  }, [filters, equipmentData]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.layout}>
      <main className={styles.content}>
        <Table columns={columns} data={filteredData} />
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
    </div>
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
    key: "TagNumber",
    type: "text"
  },
  {
    label: "Description",
    key: "Description",
    type: "text"
  },
  {
    label: "Serial Number",
    key: "SerialNumber",
    type: "text"
  },
  {
    label: "Room",
    key: "RoomNumber",
    type: "text"
  },
  {
    label: "Building",
    key: "BuildingName",
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