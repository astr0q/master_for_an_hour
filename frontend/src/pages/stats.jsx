import { useEffect, useState } from 'react';
import { getStats } from '../services/api';
import Spinner from '../components/spinner';
import PageWrapper from '../components/pageWrapper';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend} from 'recharts';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const STATUS_COLORS = {
  new: '#22C55E',
  assigned: '#cba6f7',
  in_progress: '#f9e2af',
  completed: '#a6e3a1',
  cancelled: '#f38ba8',
};

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
    <PageWrapper>
      <div>
        <h2 style={{color:'#888'}}>Statistics</h2>

        {/* key numbers */}
        <div style={styles.grid}>
          <StatCard label="Total Requests" value={stats.total_requests} color="#22C55E" />
          <StatCard label="Active" value={stats.active_requests} color="#f9e2af" />
          <StatCard label="Completed" value={stats.completed_requests} color="#a6e3a1" />
          <StatCard label="Cancelled" value={stats.cancelled_requests} color="#f38ba8" />
          <StatCard label="Total Masters" value={stats.total_masters} color="#cba6f7" />
          <StatCard label="Available Masters" value={stats.available_masters} color="#94e2d5" />
        </div>

        {/* by service — bar chart */}
        <h3>Requests by Service</h3>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={stats.by_service} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="service__name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#22C55E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* by status — pie chart */}
        <h3>Requests by Status</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={stats.by_status}
                dataKey="total"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ status, percent }) =>
                  `${status} ${(percent * 100).toFixed(0)}%`
                }
              >
                {stats.by_status.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[entry.status] || '#ccc'}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
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
    border: '1px solid #374151',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: '13px',
    color: '#9CA3AF',
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
    borderBottom: '2px solid #374151',
    fontSize: '14px',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #374151',
    fontSize: '14px',
  }
};
