import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import HowItWorks from '../components/HowItWorks';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTA = () => {
    if (user) {
      if (user.role === 'operator') {
        navigate('/allRequest');
      } else if (user.role === 'master') {
        navigate('/myJobs');
      } else {
        navigate('/newRequest');
      }
    } else {
      navigate('/register');
    }
  };
  return (
    <div className="landing-page">
      <HeroSection />
      <ServicesSection />
      <HowItWorks />
      
      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <div className="trust-item">
              <div className="trust-number">5K+</div>
              <div className="trust-label">Happy Customers</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">98%</div>
              <div className="trust-label">Satisfaction Rate</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">500+</div>
              <div className="trust-label">Verified Masters</div>
            </div>
            <div className="trust-item">
              <div className="trust-number">24/7</div>
              <div className="trust-label">Available Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Your Repairs Done?</h2>
            <p>{user ? 'Book your next repair service' : 'Join thousands of happy customers who trust Master for an Hour'}</p>
            <button className="btn btn-primary btn-lg" onClick={handleCTA}>
              {user ? 'Book a Service' : 'Start Booking Now'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
