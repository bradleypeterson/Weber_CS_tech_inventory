import { X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current?.open && !isOpen) {
      dialogRef.current?.close();
    } else if (!dialogRef.current?.open && isOpen) {
      dialogRef.current?.showModal();
    }
  }, [isOpen]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClick={handleBackdropClick} onClose={onClose}>
      <button onClick={onClose} className={styles.close}>
        <X />
      </button>
      <div className={styles.content}>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </dialog>
  );
}
