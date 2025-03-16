import { ArrowRight, Barcode } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import type { APIResponse } from "../../../../@types/api";
import { Notes } from "../../components/Notes/Notes";
import { IconButton } from "../../elements/IconButton/IconButton";
import { IconInput } from "../../elements/IconInput/IconInput";
import { Modal } from "../../elements/Modal/Modal";
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
  status?: number;
}

export function NewAudit() {
  const linkTo = useLinkTo();
  const { filters } = useFilters();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room_id');
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");
  const [itemStatuses, setItemStatuses] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<EquipmentDetailsRow | null>(null);

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

  const scanItem = useMutation({
    mutationFn: async (itemBarcode: string) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/audits/scan-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          itemBarcode,
          roomId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to scan item');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setError("");
      setBarcode("");

      if (data.status === "not_assigned_to_room") {
        setPendingItem(data.data);
        setIsModalOpen(true);
      } else {
        // Set status to "Found" (1) when item is scanned
        if (data.data.TagNumber) {
          setItemStatuses(prev => ({
            ...prev,
            [data.data.TagNumber]: 1
          }));
        }
      }
    },
    onError: (error) => {
      console.error('Failed to scan item:', error);
      setBarcode("");
      setError("Invalid item barcode");
    }
  });

  const handleScanSubmit = () => {
    if (!barcode) return;
    scanItem.mutate(barcode);
  };

  const handleStatusChange = (value: number, rowIndex: number) => {
    if (!equipmentData?.data?.[rowIndex]) return;
    const tagNumber = equipmentData.data[rowIndex].TagNumber;
    setItemStatuses(prev => ({
      ...prev,
      [tagNumber]: value
    }));
  };

  const handleAddItemToAudit = () => {
    if (pendingItem) {
      // Add item to the list with "Turned-In" status (4)
      setItemStatuses(prev => ({
        ...prev,
        [pendingItem.TagNumber]: 4
      }));
      
      // Add item to equipment data
      if (equipmentData?.status === "success") {
        equipmentData.data.push(pendingItem);
      }
    }
    setIsModalOpen(false);
    setPendingItem(null);
  };

  const handleCancelAdd = () => {
    setIsModalOpen(false);
    setPendingItem(null);
    setBarcode("");
  };

  const filteredData = useMemo(() => {
    if (!equipmentData || equipmentData.status !== "success") return [];
    
    return equipmentData.data.filter((row: EquipmentDetailsRow) => {
      const departmentMatch = !filters.Department?.length || filters.Department.includes(row.DepartmentID);
      const buildingMatch = !filters.Building?.length || filters.Building.includes(row.BuildingID);
      const locationMatch = !filters.Room?.length || filters.Room.includes(row.LocationID);
      
      return departmentMatch && buildingMatch && locationMatch;
    }).map(row => ({
      ...row,
      status: itemStatuses[row.TagNumber] || undefined
    }));
  }, [filters, equipmentData, itemStatuses]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.layout}>
      <main className={styles.content}>
        <div className={styles.scanSection}>
          <div className={styles.errorMessage}>
            {error}
          </div>
          <div className={styles.inputRow}>
            <IconInput
              placeholder="Scan Item Barcode"
              icon={<Barcode />}
              width="350px"
              value={barcode}
              onChange={(value) => setBarcode(value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleScanSubmit();
                }
              }}
              autoFocus
            />
            <IconButton
              icon={<ArrowRight />}
              variant="primary"
              disabled={barcode === "" || scanItem.isLoading}
              onClick={handleScanSubmit}
            />
          </div>
        </div>
        <Table 
          columns={columns} 
          data={filteredData} 
          selectable={true} 
          onDataChange={(newData: EquipmentDetailsRow[]) => {
            // Find the changed row by comparing with current data
            const changedRow = newData.find((row: EquipmentDetailsRow, index: number) => 
              row.status !== filteredData[index].status
            );
            
            if (changedRow && typeof changedRow.status === 'number') {
              // Find the index in the original data
              const rowIndex = equipmentData?.data.findIndex(
                (item: EquipmentDetailsRow) => item.TagNumber === changedRow.TagNumber
              ) ?? -1;
              
              if (rowIndex !== -1) {
                handleStatusChange(changedRow.status, rowIndex);
              }
            }
          }}
        />
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelAdd}
        title="Item not Assigned to this Room"
      >
        <div className={styles.modalContent}>
          <p>Would you like to add it to the Audit</p>
          <div className={styles.modalButtons}>
            <button onClick={handleCancelAdd} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleAddItemToAudit} className={styles.submitButton}>
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const columns: Column[] = [  
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
      { value: 1, label: "Found" },
      { value: 2, label: "Damaged" },
      { value: 3, label: "Missing" },
      { value: 4, label: "Turned-In" }
    ]
  }
];