import { useState, useEffect } from 'react';
import { getServices, createRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NewRequest() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    service_id: '',
    description: '',
    address: '',
    scheduled_at: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getServices().then(res => setServices(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequest({ ...form, customer_id: user.profile_id });
      setMessage('Request created successfully!');
      setForm({ service_id: '', description: '', address: '', scheduled_at: '' });
    } catch (err) {
      setMessage('Failed to create request');
    }
  };

  return (
    <div>
      <h2>New Repair Request</h2>
      <form onSubmit={handleSubmit}>
        <select name="service_id" onChange={handleChange} value={form.service_id} required>
          <option value="">Select a service</option>
          {services.map(s => (
            <option key={s.service_id} value={s.service_id}>
              {s.name} — ${s.base_price}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Describe the problem"
          onChange={handleChange}
          value={form.description}
          rows={3}
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          value={form.address}
          required
        />

        <input
          name="scheduled_at"
          type="datetime-local"
          onChange={handleChange}
          value={form.scheduled_at}
        />

        <button type="submit">Submit Request</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}