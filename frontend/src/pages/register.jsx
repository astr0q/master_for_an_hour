import { useState } from 'react';
import { registerUser } from '../services/api';
import { validateRegister } from '../utils/validate';
import PageWrapper from '../components/pageWrapper';
import Spinner from '../components/spinner';

function FieldError({ error }) {
  if (!error) return null;
  return <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</p>;
}

export default function Register() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: ''
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateRegister(form);
    if (validationError) {
      setErrors({ general: validationError });
      return;
    }

    try {
      setLoading(true);

      await registerUser(form);

      setMessage('Registered successfully! You can now log in.');
      setErrors({});

      setForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'customer',
        phone: ''
      });
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || 'Registration failed'
      });
    } finally {
      setLoading(false);
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
    <PageWrapper>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          Create account
        </h2>

        {errors.general && <FieldError error={errors.general} />}
        {message && (
          <p style={{ color: 'green', fontSize: '13px', marginBottom: '10px' }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>First name</label>
          <input
            name="first_name"
            placeholder="John"
            onChange={handleChange}
            value={form.first_name}
            disabled={loading}
          />
          <FieldError error={errors.first_name} />

          <label style={styles.label}>Last name</label>
          <input
            name="last_name"
            placeholder="Doe"
            onChange={handleChange}
            value={form.last_name}
            disabled={loading}
          />
          <FieldError error={errors.last_name} />

          <label style={styles.label}>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@email.com"
            onChange={handleChange}
            value={form.email}
            disabled={loading}
          />
          <FieldError error={errors.email} />

          <label style={styles.label}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            value={form.password}
            disabled={loading}
          />
          <FieldError error={errors.password} />

          <label style={styles.label}>Phone (optional)</label>
          <input
            name="phone"
            placeholder="+371 ..."
            onChange={handleChange}
            value={form.phone}
            disabled={loading}
          />

          <button
            type="submit"
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}


const styles = {
  card: {
    maxWidth: '420px',
    margin: '60px auto',
    backgroundColor: 'white',
    padding: '36px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '4px',
    marginTop: '12px',
    color: '#444',
  },
  btn: {
    width: '100%',
    marginTop: '20px',
    padding: '11px',
    backgroundColor: '#89b4fa',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
  }
};
