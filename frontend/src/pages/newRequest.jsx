import { useState, useEffect } from 'react';
import { getServices, createRequest } from '../services/api';
import { useAuth } from '../context/authContext';
import { validateRequest } from '../utils/validate';
import Spinner from '../components/spinner';
import PageWrapper from '../components/pageWrapper';

export default function NewRequest() {
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    service_id: '',
    description: '',
    address: '',
    scheduled_at: ''
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);

      const res = await getServices();
      setServices(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateRequest(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createRequest({
        ...form,
        customer_id: user.profile_id
      });

      setMessage('Request created successfully!');
      setError('');

      setForm({
        service_id: '',
        description: '',
        address: '',
        scheduled_at: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create request');
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
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>New Repair Request</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            name="service_id"
            onChange={handleChange}
            value={form.service_id}
            required
            style={styles.input}
          >
            <option value="">Select a service</option>
            {services.map(s => (
              <option key={s.service_id} value={s.service_id}>
                {s.name} — ${s.base_price}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Describe the problem (max 500 characters)"
            onChange={handleChange}
            value={form.description}
            rows={3}
            style={styles.textarea}
          />

          <small>{form.description.length}/500</small>

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={form.address}
            required
            style={styles.input}
          />

          <input
            name="scheduled_at"
            type="datetime-local"
            onChange={handleChange}
            value={form.scheduled_at}
            style={styles.input}
          />

          <button type="submit" style={styles.btn}>
            Submit Request
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

const styles = {
  card: {
    maxWidth: '500px',
    margin: '40px auto',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'vertical',
  },
  btn: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#89b4fa',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};