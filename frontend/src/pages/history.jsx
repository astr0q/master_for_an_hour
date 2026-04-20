import { useEffect, useState } from 'react';
import { getHistory, getServices } from '../services/api';
import { useAuth } from '../context/authContext';
import Spinner from '../components/spinner';
import PageWrapper from '../components/pageWrapper';

const statusColors = {
  completed: '#a6e3a1',
  cancelled: '#f38ba8',
};

export default function History() {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: '',
    service_id: '',
    date_from: '',
    date_to: '',
  });

  const fetchHistory = async (customFilters = filters) => {
    try {
      setLoading(true);

      const params = {
        role: user.role,
        user_id: user.profile_id,
        ...(customFilters.status && { status: customFilters.status }),
        ...(customFilters.service_id && { service_id: customFilters.service_id }),
        ...(customFilters.date_from && { date_from: customFilters.date_from }),
        ...(customFilters.date_to && { date_to: customFilters.date_to }),
      };

      const res = await getHistory(params);
      setRecords(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const [servicesRes] = await Promise.all([
        getServices(),
      ]);

      setServices(servicesRes.data);
      await fetchHistory();
    };

    loadData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchHistory(filters);
  };

  const handleClearFilters = () => {
    const resetFilters = {
      status: '',
      service_id: '',
      date_from: '',
      date_to: '',
    };

    setFilters(resetFilters);
    fetchHistory(resetFilters);
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
              <option key={s.service_id} value={s.service_id}>
                {s.name}
              </option>
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

              <span
                style={{
                  ...styles.badge,
                  backgroundColor: statusColors[r.status] || '#ccc'
                }}
              >
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

              <span>
                Created: {new Date(r.created_at).toLocaleDateString()}
              </span>

              {r.scheduled_at && (
                <span>
                  Scheduled: {new Date(r.scheduled_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}