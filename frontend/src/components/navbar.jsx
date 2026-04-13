import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>Master for an Hour</span>

      <div style={styles.links}>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}

        {user?.role === 'customer' && (
          <>
            <Link to="/new-request" style={styles.link}>New Request</Link>
            <Link to="/my-requests" style={styles.link}>My Requests</Link>
          </>
        )}

        {user?.role === 'operator' && (
          <>
            <Link to="/all-requests" style={styles.link}>All Requests</Link>
            <Link to="/assign" style={styles.link}>Assign Masters</Link>
            <Link to="/reports" style={styles.link}>Reports</Link>
          </>
        )}

        {user?.role === 'master' && (
          <>
            <Link to="/my-jobs" style={styles.link}>My Jobs</Link>
            <Link to="/availability" style={styles.link}>Availability</Link>
          </>
        )}

        {user && (
          <>
            <span style={styles.userInfo}>👤 {user.first_name} {user.last_name}</span>
            <button onClick={handleLogout} style={styles.logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#1e1e2e',
    color: 'white',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: 'white',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  link: {
    color: '#cdd6f4',
    textDecoration: 'none',
    fontSize: '14px',
  },
  userInfo: {
    fontSize: '14px',
    color: '#a6e3a1',
  },
  logout: {
    backgroundColor: '#f38ba8',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};