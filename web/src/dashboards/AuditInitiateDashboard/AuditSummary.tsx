import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useAuth } from "../../hooks/useAuth";
import { useLinkTo } from "../../navigation/useLinkTo";
import styles from "./AuditSummary.module.css";

interface StatusCounts {
  found: number;
  damaged: number;
  missing: number;
  turnedIn: number;
}

interface AuditSubmission {
  roomId: string;
  itemStatuses: Record<string, number>;
  notes: string[];
}

export function AuditSummary() {
  const { permissions, token } = useAuth();
  const linkTo = useLinkTo();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    found: 0,
    damaged: 0,
    missing: 0,
    turnedIn: 0
  });

  const submitAudit = useMutation({
    mutationFn: async (data: AuditSubmission) => {
      if (!token) throw new Error('Not authenticated');

      console.log('Submitting audit with token:', token);
      console.log('Request data:', data);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/audits/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Submit response error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error?.message || 'Failed to submit audit');
      }

      return response.json();
    },
    onSuccess: () => {
      // Only clear localStorage after successful submission
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('audit_') || key === 'current_room_id') {
          localStorage.removeItem(key);
        }
      });
      setIsSubmitted(true);
      setError(null);
    },
    onError: (error: Error) => {
      console.error('Submit mutation error:', error);
      setError(error.message);
    }
  });

  useEffect(() => {
    // Get the room ID from localStorage
    const roomId = localStorage.getItem('current_room_id');
    if (!roomId) return;

    // Get the item statuses from localStorage
    const itemStatusesStr = localStorage.getItem(`audit_item_statuses_${roomId}`);
    if (!itemStatusesStr) return;

    try {
      const itemStatuses = JSON.parse(itemStatusesStr) as Record<string, number>;
      
      // Calculate totals
      const counts = Object.values(itemStatuses).reduce((acc: StatusCounts, status: number) => {
        switch (status) {
          case 1: // Found
            return { ...acc, found: acc.found + 1 };
          case 2: // Damaged
            return { ...acc, damaged: acc.damaged + 1 };
          case 3: // Missing
            return { ...acc, missing: acc.missing + 1 };
          case 4: // Turned-In
            return { ...acc, turnedIn: acc.turnedIn + 1 };
          default:
            return acc;
        }
      }, {
        found: 0,
        damaged: 0,
        missing: 0,
        turnedIn: 0
      } as StatusCounts);

      setStatusCounts(counts);
    } catch (error) {
      console.error('Error parsing item statuses:', error);
      setError('Failed to parse audit data');
    }
  }, []);

  if (!permissions.includes(1)) {
    return (
      <main className={styles.layout}>
        <div className={styles.content}>
          <div style={{ color: "red" }}>You do not have permission to submit audits.</div>
        </div>
      </main>
    );
  }

  const handleSubmit = () => {
    const roomId = localStorage.getItem('current_room_id');
    if (!roomId) {
      setError('No room ID found');
      return;
    }

    const itemStatusesStr = localStorage.getItem(`audit_item_statuses_${roomId}`);
    const notesStr = localStorage.getItem(`audit_notes_${roomId}`);

    if (!itemStatusesStr) {
      setError('No audit data found');
      return;
    }

    try {
      const itemStatuses = JSON.parse(itemStatusesStr);
      const notes = notesStr ? JSON.parse(notesStr) : [];

      submitAudit.mutate({
        roomId,
        itemStatuses,
        notes
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to prepare audit data');
    }
  };

  const handleFinish = () => {
    linkTo("Initiate Audit", ["Audits"]);
  };
  
  if (isSubmitted) {
    return (
      <main className={styles.layout}>
        <div className={styles.content}>
          <h1>Audit Submitted</h1>
          
          <div className={styles.details}>
            <div className={styles.detailItem}>Time: {new Date().toLocaleTimeString()}</div>
            <div className={styles.detailItem}>Date: {new Date().toLocaleDateString()}</div>
          </div>

          <button 
            className={styles.finishButton}
            onClick={handleFinish}
          >
            Finish
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.layout}>
      <div className={styles.content}>
        <h1>Audit Summary</h1>
        
        <div className={styles.summary}>
          <div className={styles.summaryItem}>Found Items: {statusCounts.found}</div>
          <div className={styles.summaryItem}>Damaged Items: {statusCounts.damaged}</div>
          <div className={styles.summaryItem}>Missing Items: {statusCounts.missing}</div>
          <div className={styles.summaryItem}>Turned-In Items: {statusCounts.turnedIn}</div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button 
          className={styles.confirmButton}
          onClick={handleSubmit}
          disabled={submitAudit.isLoading}
        >
          {submitAudit.isLoading ? 'Submitting...' : 'Submit Audit'}
        </button>
      </div>
    </main>
  );
}