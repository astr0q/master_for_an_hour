import { useEffect, useState } from 'react';
import { getHistory, getServices } from '../services/api';
import { useAuth } from '../context/authContext';

const statusColors = {
  completed: '#a6e3a1',
  cancelled: '#f38ba8',
};

export default function History() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    service_id: '',
    date_from: '',
    date_to: '',
  });

  const fetchHistory = () => {
    const params = { role: user.role, user_id: user.profile_id };
    if (filters.status) params.status = filters.status;
    if (filters.service_id) params.service_id = filters.service_id;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;

    getHistory(params).then(res => setRecords(res.data));
  };

  useEffect(() => {
    getServices().then(res => setServices(res.data));
    fetchHistory();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchHistory();
  };

  const handleClearFilters = () => {
    setFilters({ status: '', service_id: '', date_from: '', date_to: '' });
    getHistory({ role: user.role, user_id: user.profile_id })
      .then(res => setRecords(res.data));
  };

  return (
    <div>
      <h2>Repair History</h2>

      {/* filters */}
      <div style={styles.filterBar}>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select name="service_id" value={filters.service_id} onChange={handleFilterChange}>
          <option value="">All services</option>
          {services.map(s => (
            <option key={s.service_id} value={s.service_id}>{s.name}</option>
          ))}
        </select>

        <input
          type="date"
          name="date_from"
          value={filters.date_from}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="date_to"
          value={filters.date_to}
          onChange={handleFilterChange}
        />

        <button onClick={handleApplyFilters} style={styles.btnApply}>
          Apply
        </button>
        <button onClick={handleClearFilters} style={styles.btnClear}>
          Clear
        </button>
      </div>

      {/* results */}
      {records.length === 0 && (
        <p style={{ color: '#888' }}>No records found.</p>
      )}

      {records.map(r => (
        <div key={r.request_id} style={styles.card}>
          <div style={styles.header}>
            <strong>{r.service_name}</strong>
            <span style={{
              ...styles.badge,
              backgroundColor: statusColors[r.status] || '#ccc'
            }}>
              {r.status}
            </span>
          </div>

          <p>{r.address}</p>
          {r.description && <p style={styles.desc}>{r.description}</p>}

          <div style={styles.meta}>
            {user.role === 'operator' && (
              <span>Customer: {r.customer_name}</span>
            )}
            {r.assigned_master_name && (
              <span>Master: {r.assigned_master_name}</span>
            )}
            <span>Created: {new Date(r.created_at).toLocaleDateString()}</span>
            {r.scheduled_at && (
              <span>Scheduled: {new Date(r.scheduled_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  btnApply: {
    backgroundColor: '#89b4fa',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  btnClear: {
    backgroundColor: '#ccc',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  badge: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  desc: {
    color: '#666',
    fontSize: '14px',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '10px',
    fontSize: '13px',
    color: '#888',
  }
};