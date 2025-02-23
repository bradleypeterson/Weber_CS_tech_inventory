import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AuditSummary.module.css";

export function AuditSummary() {
  const linkTo = useLinkTo();
  
  return (
    <main className={styles.layout}>
      <div className={styles.content}>
        <h1>Audit Summary:</h1>
        
        <div className={styles.summary}>
          <div className={styles.summaryItem}>Found Items: 1</div>
          <div className={styles.summaryItem}>Missed Items: 0</div>
          <div className={styles.summaryItem}>Added Items: 1</div>
        </div>

        <div className={styles.buttons}>
          <button 
            className={styles.backButton}
            onClick={() => linkTo("New Audit", ["Audits", "Initiate Audit"])}
          >
            Back
          </button>
          <button 
            className={styles.confirmButton}
            onClick={() => linkTo("Audit Submitted", ["Audits", "Initiate Audit"])}
          >
            Confirm
          </button>
        </div>
      </div>
    </main>
  );
}