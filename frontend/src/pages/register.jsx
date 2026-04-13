import { useState } from 'react';
import { registerUser } from '../services/api';
import { validateRegister } from '../utils/validate';

export default function Register() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    password: '', role: 'customer', phone: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateRegister(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await registerUser(form);
      setMessage('Registered successfully! You can now log in.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First name" onChange={handleChange} required />
        <input name="last_name" placeholder="Last name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <select name="role" onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="operator">Operator</option>
          <option value="master">Master</option>
        </select>
        <input name="phone" placeholder="Phone (optional)" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}