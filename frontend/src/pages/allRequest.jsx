import { useEffect, useState } from 'react';
import { getRequests, updateStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['new', 'assigned', 'in_progress', 'completed', 'cancelled'];

export default function AllRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    getRequests('operator', user.profile_id)
      .then(res => setRequests(res.data));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    await updateStatus(requestId, {
      status: newStatus,
      updated_by: user.profile_id,
      note: `Status changed to ${newStatus}`
    });
    fetchRequests();
  };

  return (
    <div>
      <h2>All Requests</h2>
      {requests.map(r => (
        <div key={r.request_id} style={styles.card}>
          <strong>{r.service_name}</strong> — {r.customer_name}
          <p>{r.address}</p>
          <p>{r.description}</p>
          <p>Master: {r.assigned_master_name || 'Not assigned'}</p>
          <select
            value={r.status}
            onChange={(e) => handleStatusChange(r.request_id, e.target.value)}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <small>{new Date(r.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
  }
};