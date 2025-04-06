import { Pencil, Plus } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Button } from "../../elements/Button/Button";
import { IconButton } from "../../elements/IconButton/IconButton";
import { Modal } from "../../elements/Modal/Modal";
import { SingleSelect } from "../../elements/SingleSelect/SingleSelect";
import { TextArea } from "../../elements/TextArea/TextArea";
import styles from "./ItemNotes.module.css";

type Equipment = {
  TagNumber: string;
  Description: string;
};

type ItemNote = {
  tagNumber: string;
  note: string;
};

type Props = {
  itemNotes: ItemNote[];
  equipmentItems: Equipment[];
  onAdd?: (tagNumber: string, note: string) => void;
};

export function ItemNotes({ itemNotes, equipmentItems, onAdd }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [selectedTagNumber, setSelectedTagNumber] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle saving new or updated notes
  function handleSaveNote() {
    if (!onAdd || !selectedTagNumber || !newNoteText.trim()) return;
    
    onAdd(selectedTagNumber, newNoteText.trim());
    
    // Reset form
    setNewNoteText("");
    setSelectedTagNumber("");
    setIsEditing(false);
    setModalOpen(false);
  }

  // Function to handle opening the edit modal for an existing note
  function handleEditNote(note: ItemNote) {
    setSelectedTagNumber(note.tagNumber);
    setNewNoteText(note.note);
    setIsEditing(true);
    setModalOpen(true);
  }

  // Prepare options for dropdown
  const equipmentOptions = useMemo(() => {
    // Filter out undefined or null items first
    const validItems = equipmentItems.filter(item => item && item.TagNumber);
    
    // Then filter out duplicates based on TagNumber
    const uniqueItems = validItems.reduce((acc, item) => {
      const tagNumber = String(item.TagNumber);
      if (!acc.some(existing => String(existing.TagNumber) === tagNumber)) {
        acc.push(item);
      }
      return acc;
    }, [] as typeof equipmentItems);
    
    return uniqueItems.map(item => ({
      label: `${item.TagNumber} - ${item.Description || 'Unknown'}`,
      value: String(item.TagNumber)
    }));
  }, [equipmentItems]);

  // Clear form when modal is closed
  function handleCloseModal() {
    setModalOpen(false);
    setNewNoteText("");
    setSelectedTagNumber("");
    setIsEditing(false);
  }

  // Open the modal to add a new note
  function handleOpenAddModal() {
    setIsEditing(false);
    setNewNoteText("");
    setSelectedTagNumber("");
    setModalOpen(true);
  }

  return (
    <>
      <div className={styles.notesContainer}>
        <div className={styles.row}>
          <h3>Item Notes</h3>
          <IconButton 
            icon={<Plus />} 
            variant="secondary" 
            onClick={handleOpenAddModal} 
          />
        </div>
        <div>
          {itemNotes.length === 0 && <span style={{ color: "var(--white-dim)" }}>Nothing to see here</span>}
          {itemNotes.map((note, index) => {
            const item = equipmentItems.find(i => i.TagNumber === note.tagNumber);
            const itemDescription = item ? `${item.TagNumber} - ${item.Description}` : note.tagNumber;
            
            return (
              <article key={`note-${index}`} className={styles.note}>
                <div className={styles.noteHeader}>
                  {itemDescription}
                  <IconButton 
                    icon={<Pencil size={16} />} 
                    variant="secondary" 
                    onClick={() => handleEditNote(note)} 
                  />
                </div>
                <div className={styles.noteBody}>{note.note}</div>
              </article>
            );
          })}
        </div>
      </div>
      <Modal onClose={handleCloseModal} isOpen={modalOpen}>
        <div className={styles.noteModalContent}>
          <h3>{isEditing ? 'Edit Item Note' : 'New Item Note'}</h3>
          <div>
            <label>Select Item</label>
            <SingleSelect
              options={equipmentOptions}
              value={selectedTagNumber}
              onChange={(value) => setSelectedTagNumber(value as string)}
              placeholder="Select an item"
              disabled={isEditing} // Disable changing the item when editing
            />
          </div>
          <TextArea 
            label="Note"
            value={newNoteText} 
            onChange={(value) => setNewNoteText(value)} 
          />
          <div className={styles.row}>
            <Button variant="secondary" size="small" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="small" 
              onClick={handleSaveNote}
              disabled={!selectedTagNumber || !newNoteText}
            >
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
} 