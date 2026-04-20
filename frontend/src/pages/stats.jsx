import { useEffect, useState } from 'react';
import { getStats } from '../services/api';
import Spinner from '../components/spinner';
import PageWrapper from '../components/pageWrapper';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await getStats();
        setStats(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h2>Statistics</h2>

        {/* key numbers */}
        <div style={styles.grid}>
          <StatCard label="Total Requests" value={stats.total_requests} color="#89b4fa" />
          <StatCard label="Active" value={stats.active_requests} color="#f9e2af" />
          <StatCard label="Completed" value={stats.completed_requests} color="#a6e3a1" />
          <StatCard label="Cancelled" value={stats.cancelled_requests} color="#f38ba8" />
          <StatCard label="Total Masters" value={stats.total_masters} color="#cba6f7" />
          <StatCard label="Available Masters" value={stats.available_masters} color="#94e2d5" />
        </div>

        {/* by service */}
        <h3>Requests by Service</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Service</th>
              <th style={styles.th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.by_service.map((row, i) => (
              <tr key={i}>
                <td style={styles.td}>{row['service__name']}</td>
                <td style={styles.td}>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* by status */}
        <h3>Requests by Status</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.by_status.map((row, i) => (
              <tr key={i}>
                <td style={styles.td}>{row.status}</td>
                <td style={styles.td}>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardLabel}>{label}</div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: '13px',
    color: '#888',
    marginTop: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '24px',
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '2px solid #ccc',
    fontSize: '14px',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
  }
};