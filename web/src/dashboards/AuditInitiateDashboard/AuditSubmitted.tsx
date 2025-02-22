import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AuditSubmitted.module.css";

export function AuditSubmitted() {
  const linkTo = useLinkTo();
  
  return (
    <main className={styles.layout}>
      <div className={styles.content}>
        <h1>Audit Submitted</h1>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>Time: 3:30 PM</div>
          <div className={styles.detailItem}>Date: April 26th 2025</div>
          <div className={styles.detailItem}>Auditor: John Doe</div>
        </div>

        <button 
          className={styles.finishButton}
          onClick={() => linkTo("Initiate Audit", ["Audits"])}
        >
          Finish
        </button>
      </div>
    </main>
  );
}
