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

      const mine = res.data.find(
        a => a.master_id === user.profile_id
      );

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

  useEffect(() => {
    fetchAvailability();
  }, []);

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

  if (loading) {
    return (
      <PageWrapper>
        <Spinner />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Requests">
      <div>
        <h2>My Availability</h2>

        <div style={{ margin: '16px 0' }}>
          <label>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            {' '}I am available for new jobs
          </label>
        </div>

        <div>
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <button onClick={handleSave}>Save</button>

        {message && <p>{message}</p>}

        {current && (
          <p style={{ color: '#888', fontSize: '13px' }}>
            Last updated: {new Date(current.updated_at).toLocaleString()}
          </p>
        )}
      </div>
    </PageWrapper>
  );
}