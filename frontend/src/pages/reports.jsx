import { useEffect, useState } from 'react';
import { getReports, getServices } from '../services/api';
import Spinner from '../components/spinner';
import PageWrapper from '../components/pageWrapper';

const STATUS_OPTIONS = ['new', 'assigned', 'in_progress', 'completed', 'cancelled'];

const statusColors = {
  new: '#89b4fa',
  assigned: '#cba6f7',
  in_progress: '#f9e2af',
  completed: '#a6e3a1',
  cancelled: '#f38ba8',
};

export default function Reports() {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    date_from: '',
    date_to: '',
    service_id: '',
    status: '',
  });

  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);

      const res = await getServices();
      setServices(res.data);

      setLoading(false);
    };

    loadServices();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      const params = {};
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      if (filters.service_id) params.service_id = filters.service_id;
      if (filters.status) params.status = filters.status;

      const res = await getReports(params);

      setSummary(res.data.summary);
      setRecords(res.data.records);
      setSearched(true);
    } finally {
      setGenerating(false);
    }
  };

  const handleClear = () => {
    setFilters({
      date_from: '',
      date_to: '',
      service_id: '',
      status: '',
    });

    setSummary(null);
    setRecords([]);
    setSearched(false);
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
        <h2>Reports</h2>

        {/* filter bar */}
        <div style={styles.filterBar}>
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

          <select
            name="service_id"
            value={filters.service_id}
            onChange={handleFilterChange}
          >
            <option value="">All services</option>
            {services.map(s => (
              <option key={s.service_id} value={s.service_id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              ...styles.btnGenerate,
              opacity: generating ? 0.7 : 1,
              cursor: generating ? 'not-allowed' : 'pointer',
            }}
          >
            {generating ? 'Generating...' : 'Generate'}
          </button>

          <button onClick={handleClear} style={styles.btnClear}>
            Clear
          </button>
        </div>

        {/* summary */}
        {summary && (
          <>
            <h3>Summary</h3>

            <div style={styles.summaryGrid}>
              <SummaryBox label="Total" value={summary.total} color="#89b4fa" />
              <SummaryBox label="Completed" value={summary.completed} color="#a6e3a1" />
              <SummaryBox label="Cancelled" value={summary.cancelled} color="#f38ba8" />
              <SummaryBox label="In Progress" value={summary.in_progress} color="#f9e2af" />
              <SummaryBox label="New" value={summary.new} color="#cdd6f4" />
              <SummaryBox label="Assigned" value={summary.assigned} color="#cba6f7" />
            </div>
          </>
        )}

        {/* empty state */}
        {searched && records.length === 0 && (
          <p style={{ color: '#888' }}>
            No records match the selected filters.
          </p>
        )}

        {/* table */}
        {records.length > 0 && (
          <>
            <h3>Records ({records.length})</h3>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Master</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>

              <tbody>
                {records.map(r => (
                  <tr key={r.request_id}>
                    <td style={styles.td}>{r.request_id}</td>
                    <td style={styles.td}>{r.service_name}</td>
                    <td style={styles.td}>{r.customer_name}</td>
                    <td style={styles.td}>{r.assigned_master_name || '—'}</td>
                    <td style={styles.td}>{r.address}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: statusColors[r.status] || '#ccc'
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </PageWrapper>
  );
}

function SummaryBox({ label, value, color }) {
  return (
    <div style={{ ...styles.summaryCard, borderTop: `4px solid ${color}` }}>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardLabel}>{label}</div>
    </div>
  );
}

const styles = {
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '24px',
    alignItems: 'center',
  },
  btnGenerate: {
    backgroundColor: '#89b4fa',
    border: 'none',
    padding: '6px 18px',
    borderRadius: '6px',
    fontWeight: 'bold',
  },
  btnClear: {
    backgroundColor: '#ccc',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
    marginBottom: '28px',
  },
  summaryCard: {
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '2px solid #ccc',
    fontSize: '13px',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '13px',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 'bold',
  }
};