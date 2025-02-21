import { Plus } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "../../elements/Button/Button";
import { IconButton } from "../../elements/IconButton/IconButton";
import { Modal } from "../../elements/Modal/Modal";
import { TextArea } from "../../elements/TextArea/TextArea";
import styles from "./Notes.module.css";

export function Notes({ notes }: { notes: string[] }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={styles.notesContainer}>
        <div className={styles.row}>
          <h3>Notes</h3>
          <IconButton icon={<Plus />} variant="secondary" onClick={() => setModalOpen(true)} />
        </div>
        <div>
          {notes.length === 0 && <span style={{ color: "var(--white-dim)" }}>Nothing to see here</span>}
          {notes.map((note) => (
            <article>{note}</article>
          ))}
        </div>
      </div>
      <Modal onClose={() => setModalOpen(false)} isOpen={modalOpen}>
        <div className={styles.noteModalContent}>
          <h3>New Note</h3>
          <TextArea />
          <div className={styles.row}>
            <Button variant="secondary" size="small" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="small">
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
