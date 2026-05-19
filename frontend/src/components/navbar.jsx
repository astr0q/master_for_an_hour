import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import NotificationBell from './notificationBell';
import './navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--space-6)' }}>
        {/* Brand/Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔧</span>
          <span className="brand-text">Master for an Hour</span>
        </Link>

        {/* Nav Links */}
        <div className="navbar-links">
          {!user && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-link-primary">Register</Link>
            </>
          )}

          {user?.role === 'customer' && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/new-request" className="nav-link">New Request</Link>
              <Link to="/my-requests" className="nav-link">My Requests</Link>
              <Link to="/history" className="nav-link">History</Link>
            </>
          )}

          {user?.role === 'operator' && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/all-requests" className="nav-link">All Requests</Link>
              <Link to="/history" className="nav-link">History</Link>
              <Link to="/stats" className="nav-link">Stats</Link>
              <Link to="/reports" className="nav-link">Reports</Link>
            </>
          )}

          {user?.role === 'master' && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/my-jobs" className="nav-link">My Jobs</Link>
              <Link to="/availability" className="nav-link">Availability</Link>
            </>
          )}

          {user && (
            <div className="user-area">
              <NotificationBell />
              <div className="user-info">
                <span className="user-name">{user.first_name} {user.last_name}</span>
                <span className={`role-badge role-${user.role}`}>
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}