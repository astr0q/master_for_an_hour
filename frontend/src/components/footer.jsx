import './footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Column */}
          <div className="footer-column">
            <div className="footer-brand">
              <h3>🔧 Master for an Hour</h3>
              <p>Professional home repairs, available 24/7. Verified masters, transparent pricing, instant booking.</p>
            </div>
          </div>

          {/* Services Column */}
          <div className="footer-column">
            <h4 className="footer-title">Services</h4>
            <ul className="footer-list">
              <li><a href="#services">Plumbing</a></li>
              <li><a href="#services">Electrical Work</a></li>
              <li><a href="#services">Locksmith</a></li>
              <li><a href="#services">Roof Repair</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-list">
              <li><a href="#about">About Us</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-column">
            <h4 className="footer-title">Contact</h4>
            <div className="footer-contact">
              <a href="mailto:support@masterforhour.com" className="contact-link">
                <span>📧</span> support@masterforhour.com
              </a>
              <a href="tel:+37120000000" className="contact-link">
                <span>📞</span> +371 20 000 000
              </a>
              <div className="contact-link">
                <span>🕐</span> Mon–Sun: 8:00–21:00
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© {currentYear} Master for an Hour. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}