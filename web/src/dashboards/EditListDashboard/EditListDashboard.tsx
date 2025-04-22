import { FloppyDisk, Plus, X } from "@phosphor-icons/react";
import { useState } from "react";
import { Modal } from "../../elements/Modal/Modal";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { Column, Table } from "../../elements/Table/Tables";
import { useAssetClasses, useConditions, useDepartments, useDeviceTypes } from "../../hooks/optionHooks";
import styles from "./EditListDashboard.module.css";

const tableConfigs = {
  department: {
    label: "Department",
    header: "Edit Department List",
    addButton: "Add Department",
    hook: useDepartments,
    idKey: "DepartmentID",
    nameKey: "Name",
    abbreviationKey: "Abbreviation"
  },
  assetClass: {
    label: "Asset Class",
    header: "Edit Asset Class List",
    addButton: "Add Asset Class",
    hook: useAssetClasses,
    idKey: "AssetClassID",
    nameKey: "Name",
    abbreviationKey: "Abbreviation"
  },
  condition: {
    label: "Condition",
    header: "Edit Condition List",
    addButton: "Add Condition",
    hook: useConditions,
    idKey: "ConditionID",
    nameKey: "ConditionName",
    abbreviationKey: "ConditionAbbreviation"
  },
  deviceType: {
    label: "Device Type",
    header: "Edit Device Type List",
    addButton: "Add Device Type",
    hook: useDeviceTypes,
    idKey: "DeviceTypeID",
    nameKey: "Name",
    abbreviationKey: "Abbreviation"
  }
};

export function EditListDashboard() {
  const [activeList, setActiveList] = useState<keyof typeof tableConfigs>("department");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", abbreviation: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ name: string; abbreviation: string }>({ name: "", abbreviation: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", action: () => {} });

  const { data, add, update, remove, isAdding, refetch } = tableConfigs[activeList].hook();

  const handleAdd = async () => {
    if (!newItem.name || !newItem.abbreviation) return;
    try {
      await add({
        [tableConfigs[activeList].nameKey]: newItem.name,
        [tableConfigs[activeList].abbreviationKey]: newItem.abbreviation
      } as any);
      setNewItem({ name: "", abbreviation: "" });
      setShowAddForm(false);
      await refetch();
    } catch (error) {
      console.error(`Failed to add ${activeList}:`, error);
    }
  };

  const handleEdit = (id: number) => {
    const item: any = data.find((d: any) => d[tableConfigs[activeList].idKey] === id);
    if (item) {
      setEditingId(id);
      setEditData({
        name: item[tableConfigs[activeList].nameKey],
        abbreviation: item[tableConfigs[activeList].abbreviationKey]
      });
    }
  };

  const handleSaveEdit = async (id: number) => {
    if (!editData.name || !editData.abbreviation) return;
    try {
      await update({
        [tableConfigs[activeList].idKey]: id,
        [tableConfigs[activeList].nameKey]: editData.name,
        [tableConfigs[activeList].abbreviationKey]: editData.abbreviation
      } as any);
      setEditingId(null);
      await refetch();
    } catch (error) {
      console.error(`Failed to update ${activeList}:`, error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await remove(id);
      setEditingId(null);
      await refetch();
    } catch (error) {
      console.error(`Failed to delete ${activeList}:`, error);
    }
  };

  const rows = (data || [])
    .filter((item: any) => item && item[tableConfigs[activeList].idKey])
    .map((item: any) => {
      const id = item[tableConfigs[activeList].idKey];
      const isEditing = editingId === id;
      return {
        id,
        name: isEditing ? editData.name : item[tableConfigs[activeList].nameKey],
        abbreviation: isEditing ? editData.abbreviation : item[tableConfigs[activeList].abbreviationKey]
      };
    });

  const columns: Column[] = [
    { key: "name", label: tableConfigs[activeList].label, type: "text" },
    { key: "abbreviation", label: "Abbreviation", type: "text" },
    {
      key: "edit",
      label: "Edit",
      type: "icon",
      icon: (rowIndex: number) => {
        const row = rows[rowIndex];
        return editingId === row?.id ? "save" : "edit";
      },
      width: "50px",
      action: (rowIndex: number) => {
        const row = rows?.[rowIndex];
        if (!row) return;

        if (editingId === row.id) {
          setModalContent({
            title: "Confirm Changes",
            message: `Are you sure you want to save these changes?`,
            action: () => handleSaveEdit(row.id)
          });
          setShowConfirmModal(true);
        } else {
          handleEdit(row.id);
        }
      }
    },
    {
      key: "delete",
      label: "Delete",
      type: "icon",
      icon: "trash",
      width: "50px",
      action: (rowIndex: number) => {
        const id = rows?.[rowIndex]?.id;
        if (!id) return;
        setModalContent({
          title: "Confirm Deletion",
          message: `Are you sure you want to delete this ${tableConfigs[activeList].label.toLowerCase()}?`,
          action: () => handleDelete(id)
        });
        setShowConfirmModal(true);
      }
    }
  ];

  return (
    <div className={styles.layout}>
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title={modalContent.title}>
        <p>{modalContent.message}</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={() => setShowConfirmModal(false)}
            style={{ padding: "8px 16px", background: "#b7b7b7", border: "none", borderRadius: "4px" }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              modalContent.action();
              setShowConfirmModal(false);
            }}
            style={{ padding: "8px 16px", background: "#7300ff", color: "white", border: "none", borderRadius: "4px" }}
          >
            Confirm
          </button>
        </div>
      </Modal>

      <div className={styles.sidebar}>
        <h2 style={{ marginBottom: "20px" }}>Select Editable List</h2>
        <SingleSelect
          options={Object.keys(tableConfigs).map((key) => ({
            value: key,
            label: tableConfigs[key as keyof typeof tableConfigs].label
          }))}
          value={activeList}
          onChange={(value: any) => {
            setActiveList(value);
            setShowAddForm(false);
            setEditingId(null);
          }}
          placeholder="Select a list"
          width="100%"
        />
      </div>

      <div className={styles.content}>
        <h1>{tableConfigs[activeList].header}</h1>
        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            data={rows}
            setEditData={setEditData}
            onDataChange={(updated) => {
              const editingRow = updated.find((d) => d.id === editingId);
              if (editingRow) {
                setEditData({ name: editingRow.name, abbreviation: editingRow.abbreviation });
              }
            }}
          />

          {!showAddForm ? (
            <button className={styles.outlineButton} onClick={() => setShowAddForm(true)} style={{ marginTop: "20px" }}>
              <Plus size={16} /> {tableConfigs[activeList].addButton}
            </button>
          ) : (
            <div className={styles.addSection} style={{ marginTop: "20px" }}>
              <input
                type="text"
                placeholder={`${tableConfigs[activeList].label} Name`}
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Abbreviation"
                value={newItem.abbreviation}
                onChange={(e) => setNewItem({ ...newItem, abbreviation: e.target.value })}
                className={styles.inputField}
              />
              <button
                onClick={handleAdd}
                disabled={isAdding || !newItem.name || !newItem.abbreviation}
                className={styles.addButton}
              >
                {isAdding ? (
                  "Adding..."
                ) : (
                  <>
                    <FloppyDisk size={16} /> Save
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={styles.iconButton}
                style={{ marginLeft: "10px" }}
              >
                <X size={20} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
