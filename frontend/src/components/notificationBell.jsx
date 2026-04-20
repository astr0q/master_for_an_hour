import { useState, useEffect, useRef } from 'react';
import { getNotifications, markRead, markAllRead } from '../services/api';
import { useAuth } from '../context/authContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = () => {
    if (!user) return;
    getNotifications(user.profile_id).then(res => setNotifications(res.data));
  };

  // poll every 30 seconds for new notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = async (notificationId) => {
    await markRead(notificationId);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllRead(user.profile_id);
    fetchNotifications();
  };

  return (
    <div ref={ref} style={styles.wrapper}>
      {/* bell button */}
      <button onClick={() => setOpen(!open)} style={styles.bell}>
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </button>

      {/* dropdown */}
      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={{ fontWeight: 'bold' }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={styles.markAllBtn}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 && (
            <p style={styles.empty}>No notifications yet</p>
          )}

          {notifications.map(n => (
            <div
              key={n.notification_id}
              style={{
                ...styles.item,
                backgroundColor: n.is_read ? 'transparent' : '#eef4ff',
              }}
            >
              <p style={{ ...styles.itemText, color: '#000' }}>
                {n.message}
            </p>
              <div style={styles.itemMeta}>
                <small style={{ color: '#888' }}>
                  {new Date(n.created_at).toLocaleString()}
                </small>
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.notification_id)}
                    style={styles.readBtn}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  bell: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    position: 'relative',
    padding: '4px',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#f38ba8',
    color: 'white',
    borderRadius: '50%',
    fontSize: '10px',
    fontWeight: 'bold',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '36px',
    width: '320px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  markAllBtn: {
    background: 'none',
    border: 'none',
    color: '#89b4fa',
    cursor: 'pointer',
    fontSize: '12px',
  },
  empty: {
    padding: '16px',
    color: '#888',
    textAlign: 'center',
  },
  item: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
  },
  itemText: {
    margin: '0 0 4px',
    fontSize: '13px',
  },
  itemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readBtn: {
    background: 'none',
    border: 'none',
    color: '#89b4fa',
    cursor: 'pointer',
    fontSize: '11px',
  }
};