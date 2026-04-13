import { useEffect, useState } from 'react';
import { getRequests } from '../services/api';
import { useAuth } from '../context/authContext';

const statusColors = {
  new: '#89b4fa',
  assigned: '#cba6f7',
  in_progress: '#f9e2af',
  completed: '#a6e3a1',
  cancelled: '#f38ba8',
};

export default function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRequests('customer', user.profile_id)
      .then(res => setRequests(res.data));
  }, []);

  return (
    <div>
      <h2>My Requests</h2>
      {requests.length === 0 && <p>No requests yet.</p>}
      {requests.map(r => (
        <div key={r.request_id} style={styles.card}>
          <strong>{r.service_name}</strong>
          <span style={{
            ...styles.badge,
            backgroundColor: statusColors[r.status] || '#ccc'
          }}>
            {r.status}
          </span>
          <p>{r.address}</p>
          <p>{r.description}</p>
          {r.assigned_master_name && <p>Master: {r.assigned_master_name}</p>}
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
  },
  badge: {
    marginLeft: '10px',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  }
};