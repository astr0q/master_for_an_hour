import { useEffect, useState } from 'react';
import { getRequests, updateStatus, getMasters, assignMaster } from '../services/api';
import { useAuth } from '../context/authContext';

const STATUS_OPTIONS = ['new', 'assigned', 'in_progress', 'completed', 'cancelled'];

export default function AllRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [masters, setMasters] = useState([]);
  const [selectedMasters, setSelectedMasters] = useState({});

  const fetchRequests = () => {
    getRequests('operator', user.profile_id)
      .then(res => setRequests(res.data));
  };

  useEffect(() => {
    fetchRequests();
    getMasters().then(res => setMasters(res.data));
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    await updateStatus(requestId, {
      status: newStatus,
      updated_by: user.profile_id,
      note: `Status changed to ${newStatus}`
    });
    fetchRequests();
  };

  const handleAssign = async (requestId, masterId) => {
    if (!masterId) return;
    await assignMaster(requestId, {
      master_id: masterId,
      updated_by: user.profile_id
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

          <div style={styles.row}>
            <label>Status:</label>
            <select
              value={r.status}
              onChange={(e) => handleStatusChange(r.request_id, e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={styles.row}>
              <label>Assign master:</label>
              <select
                value={selectedMasters[r.request_id] ?? r.assigned_master_id ?? ''}
                onChange={(e) =>
                  setSelectedMasters({ ...selectedMasters, [r.request_id]: e.target.value })
                }
            >
              <option value="">-- select master --</option>
              {masters.map(m => (
                <option key={m.profile_id} value={m.profile_id}>
                  {m.first_name} {m.last_name}
                </option>
            ))}
          </select>

          <button
              onClick={() => handleAssign(r.request_id, selectedMasters[r.request_id])}
              disabled={!selectedMasters[r.request_id]}
              style={styles.assignBtn}
          >
            Confirm
          </button>
        </div>

          {r.assigned_master_name && (
            <p style={{ color: '#888', fontSize: '13px' }}>
              Currently assigned: {r.assigned_master_name}
          </p>
        )}

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
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '8px 0',
  },
  assignBtn: {
    backgroundColor: '#a6e3a1',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};