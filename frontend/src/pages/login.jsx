import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/authContext';
import { validateLogin } from '../utils/validate';
import PageWrapper from '../components/pageWrapper';
import Spinner from '../components/spinner';

function FieldError({ error }) {
  if (!error) return null;
  return <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</p>;
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateLogin(form);
    if (validationError) {
      setErrors({ general: validationError });
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(form);

      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);

      if (res.data.role === 'customer') navigate('/new-request');
      else if (res.data.role === 'operator') navigate('/all-requests');
      else if (res.data.role === 'master') navigate('/my-jobs');
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || 'Login failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          Welcome back
        </h2>

        <form onSubmit={handleSubmit}>
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

          {errors.general && <FieldError error={errors.general} />}

          <button
            type="submit"
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}

const styles = {
  card: {
    maxWidth: '400px',
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