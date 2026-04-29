export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* column 1 — brand */}
        <div style={styles.col}>
          <h3 style={styles.brand}>🔧 Master for an Hour</h3>
          <p style={styles.desc}>
            Fast, reliable minor repair services for your home and office.
            Available 7 days a week.
          </p>
          <div style={styles.badges}>
            <span style={styles.badge}>⭐ Trusted Service</span>
            <span style={styles.badge}>🛡️ Verified Masters</span>
          </div>
        </div>

        {/* column 2 — services */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Our Services</h4>
          <ul style={styles.list}>
            {['Plumbing', 'Electrical Work', 'Furniture Repair',
              'Painting & Decorating', 'Appliance Repair',
              'Locksmith', 'Carpentry', 'Cleaning'].map(s => (
              <li key={s} style={styles.listItem}>› {s}</li>
            ))}
          </ul>
        </div>

        {/* column 3 — contact */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Contact Us</h4>
          <div style={styles.contactItem}>
            <span>📧</span>
            <a href="mailto:support@masterforhour.com" style={styles.link}>
              support@masterforhour.com
            </a>
          </div>
          <div style={styles.contactItem}>
            <span>📞</span>
            <span>+371 20 000 000</span>
          </div>
          <div style={styles.contactItem}>
            <span>🕐</span>
            <span>Mon–Sun: 8:00 – 21:00</span>
          </div>
          <div style={styles.contactItem}>
            <span>📍</span>
            <span>Riga, Latvia</span>
          </div>
        </div>

        {/* column 4 — map */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Find Us</h4>
          <div style={styles.mapWrapper}>
            <iframe
              title="TSI Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2176.539949141194!2d24.1560297!3d56.939549899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eece1f43ac4dd3%3A0x52ea799987446061!2sTransporta%20un%20sakaru%20instit%C5%ABts%20(TSI)!5e0!3m2!1sen!2slv!4v1777455360047!5m2!1sen!2slv" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              width="100%"
              height="160"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
            TSI — Transport and Telecommunication Institute, Riga
          </p>
        </div>

      </div>

      {/* bottom bar */}
      <div style={styles.bottomBar}>
        <span>© 2025 Master for an Hour. All rights reserved.</span>
        <span>Built with React + Django + Supabase</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#1e1e2e',
    color: '#cdd6f4',
    marginTop: '60px',
    borderTop: '3px solid #2E75B6',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  brand: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    margin: 0,
  },
  desc: {
    fontSize: '13px',
    color: '#a0aabb',
    lineHeight: '1.6',
    margin: 0,
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  },
  badge: {
    backgroundColor: '#2E75B6',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  colTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'white',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  listItem: {
    fontSize: '13px',
    color: '#a0aabb',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13px',
    color: '#a0aabb',
  },
  link: {
    color: '#89b4fa',
    textDecoration: 'none',
  },
  mapWrapper: {
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #333',
  },
  bottomBar: {
    borderTop: '1px solid #2a2a3e',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    fontSize: '12px',
    color: '#666',
    maxWidth: '1100px',
    margin: '0 auto',
  },
};