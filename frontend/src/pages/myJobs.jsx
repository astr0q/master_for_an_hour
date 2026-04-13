import { useEffect, useState } from 'react';
import { getMasterJobs, updateProgress } from '../services/api';
import { useAuth } from '../context/authContext';

const statusColors = {
  new: '#89b4fa',
  assigned: '#cba6f7',
  in_progress: '#f9e2af',
  completed: '#a6e3a1',
  cancelled: '#f38ba8',
};

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [notes, setNotes] = useState({});
  const [message, setMessage] = useState('');

  const fetchJobs = () => {
    getMasterJobs(user.profile_id).then(res => setJobs(res.data));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleNoteChange = (requestId, value) => {
    setNotes({ ...notes, [requestId]: value });
  };

  const handleProgress = async (requestId, newStatus) => {
    try {
      await updateProgress(requestId, {
        master_id: user.profile_id,
        status: newStatus,
        note: notes[requestId] || '',
      });
      setMessage(`Job marked as ${newStatus}`);
      fetchJobs();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update');
    }
  };

  return (
    <div>
      <h2>My Jobs</h2>
      {jobs.length === 0 && <p>No jobs assigned to you yet.</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {jobs.map(job => (
        <div key={job.request_id} style={styles.card}>

          <div style={styles.header}>
            <strong>{job.service_name}</strong>
            <span style={{
              ...styles.badge,
              backgroundColor: statusColors[job.status] || '#ccc'
            }}>
              {job.status}
            </span>
          </div>

          <p>{job.address}</p>
          <p>{job.description}</p>
          <small>Customer: {job.customer_name}</small>
          <br />
          <small>Scheduled: {job.scheduled_at
            ? new Date(job.scheduled_at).toLocaleString()
            : 'Not set'}
          </small>

          {/* only show buttons if job is not done or cancelled */}
          {!['completed', 'cancelled'].includes(job.status) && (
            <div style={styles.actions}>
              <textarea
                placeholder="Add a note (optional)"
                value={notes[job.request_id] || ''}
                onChange={(e) => handleNoteChange(job.request_id, e.target.value)}
                rows={2}
                style={styles.textarea}
              />

              <div style={styles.buttons}>
                {job.status === 'assigned' && (
                  <button
                    style={styles.btnStart}
                    onClick={() => handleProgress(job.request_id, 'in_progress')}
                  >
                    Start Job
                  </button>
                )}

                {job.status === 'in_progress' && (
                  <button
                    style={styles.btnComplete}
                    onClick={() => handleProgress(job.request_id, 'completed')}
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          )}

          {['completed', 'cancelled'].includes(job.status) && (
            <p style={styles.doneLabel}>
              {job.status === 'completed' ? '✓ Job completed' : '✗ Cancelled'}
            </p>
          )}

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
    marginBottom: '16px',
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
  actions: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  textarea: {
    width: '100%',
    borderRadius: '6px',
    border: '1px solid #ccc',
    padding: '8px',
    fontSize: '14px',
    resize: 'vertical',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  btnStart: {
    backgroundColor: '#f9e2af',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  btnComplete: {
    backgroundColor: '#a6e3a1',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  doneLabel: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#888',
  }
};