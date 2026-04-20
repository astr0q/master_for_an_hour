import { useEffect, useState } from 'react';
import { getAvailability, updateAvailability } from '../services/api';
import { useAuth } from '../context/authContext';
import Spinner from '../components/spinner';
import PageWrapper from '../components/pageWrapper';

export default function Availability() {
  const { user } = useAuth();
  const [current, setCurrent] = useState(null);
  const [notes, setNotes] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await getAvailability();
      const mine = res.data.find(a => a.master_id === user.profile_id);
      if (mine) {
        setCurrent(mine);
        setIsAvailable(mine.is_available);
        setNotes(mine.notes || '');
      } else {
        setCurrent(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAvailability(); }, []);

  const handleSave = async () => {
    try {
      const res = await updateAvailability({
        master_id: user.profile_id,
        is_available: isAvailable,
        notes,
      });
      setCurrent(res.data);
      setMessage('Availability updated!');
    } catch {
      setMessage('Failed to update');
    }
  };

  if (loading) return <PageWrapper><Spinner /></PageWrapper>;

  return (
    <PageWrapper>
      <div style={styles.card}>

        <div style={styles.row}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              style={styles.checkbox}
            />
            I am available for new jobs
          </label>
          <span style={{
            ...styles.badge,
            backgroundColor: isAvailable ? '#a6e3a1' : '#f38ba8',
          }}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Notes (optional)</label>
          <textarea
            placeholder="e.g. available weekdays only, no electrical jobs this week..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            style={styles.textarea}
          />
        </div>

        <button onClick={handleSave} style={styles.btnSave}>
          Save
        </button>

        {message && (
          <p style={styles.successMsg}>{message}</p>
        )}

        {current && current.updated_at && (
          <p style={styles.lastUpdated}>
            Last updated: {new Date(current.updated_at).toLocaleString()}
          </p>
        )}

      </div>
    </PageWrapper>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    border: '1px solid #e5e5ea',
    borderRadius: '10px',
    padding: '24px',
    maxWidth: '560px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#1e1e2e',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '6px',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  btnSave: {
    backgroundColor: '#89b4fa',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  successMsg: {
    marginTop: '12px',
    color: '#3a7d44',
    fontSize: '14px',
    fontWeight: '500',
  },
  lastUpdated: {
    marginTop: '12px',
    color: '#aaa',
    fontSize: '12px',
  },
};