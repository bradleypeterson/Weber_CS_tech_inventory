import { Plus } from "@phosphor-icons/react";
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

  function handleAdd() {
    if (onAdd && selectedTagNumber && newNoteText.trim()) {
      onAdd(selectedTagNumber, newNoteText.trim());
      setNewNoteText("");
      setSelectedTagNumber("");
    }
    setModalOpen(false);
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

  return (
    <>
      <div className={styles.notesContainer}>
        <div className={styles.row}>
          <h3>Item Notes</h3>
          <IconButton icon={<Plus />} variant="secondary" onClick={() => setModalOpen(true)} />
        </div>
        <div>
          {itemNotes.length === 0 && <span style={{ color: "var(--white-dim)" }}>Nothing to see here</span>}
          {itemNotes.map((note, index) => {
            const item = equipmentItems.find(i => i.TagNumber === note.tagNumber);
            const itemDescription = item ? `${item.TagNumber} - ${item.Description}` : note.tagNumber;
            
            return (
              <article key={`note-${index}`} className={styles.note}>
                <div className={styles.noteHeader}>{itemDescription}</div>
                <div className={styles.noteBody}>{note.note}</div>
              </article>
            );
          })}
        </div>
      </div>
      <Modal onClose={() => setModalOpen(false)} isOpen={modalOpen}>
        <div className={styles.noteModalContent}>
          <h3>New Item Note</h3>
          <div>
            <label>Select Item</label>
            <SingleSelect
              options={equipmentOptions}
              value={selectedTagNumber}
              onChange={(value) => setSelectedTagNumber(value as string)}
              placeholder="Select an item"
            />
          </div>
          <TextArea 
            label="Note"
            value={newNoteText} 
            onChange={(value) => setNewNoteText(value)} 
          />
          <div className={styles.row}>
            <Button variant="secondary" size="small" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button 
              variant="primary" 
              size="small" 
              onClick={handleAdd}
              disabled={!selectedTagNumber || !newNoteText}
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
} 