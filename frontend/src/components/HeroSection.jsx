import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './HeroSection.css';

export default function HeroSection() {
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
  const [formData, setFormData] = useState({
    service: '',
    description: '',
    address: '',
    date: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const services = [
    { icon: '🔧', name: 'Plumbing' },
    { icon: '⚡', name: 'Electrical' },
    { icon: '🛋️', name: 'Furniture' },
    { icon: '🍽️', name: 'Appliances' },
    { icon: '🔐', name: 'Locksmith' },
    { icon: '✨', name: 'Cleaning' },
  ];

  const stats = [
    { number: '5K+', label: 'Repairs Done' },
    { number: '98%', label: 'Satisfaction' },
    { number: '24/7', label: 'Available' },
  ];

  return (
    <section className="hero-section">
      <div className="container container-lg">
        <div className="hero-content">
          {/* Left Column */}
          <div className="hero-left animate-slide-left">
            <div className="hero-badge">
              <span className="badge-dot">•</span>
              <span>Your Trusted Repair Partner</span>
            </div>

            <h1 className="hero-title">
              Professional Home Repairs,
              <span className="text-accent"> Just One Click Away</span>
            </h1>

            <p className="hero-subtitle">
              Book verified masters for any repair job. Fast, reliable, and transparent pricing. Get your home fixed today.
            </p>

            {/* Stats */}
            <div className="hero-stats">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Service Highlights */}
            <div className="service-highlights">
              <p className="highlights-label">Available Services</p>
              <div className="service-grid">
                {services.slice(0, 3).map((service, idx) => (
                  <div key={idx} className="service-chip">
                    <span className="service-icon">{service.icon}</span>
                    <span>{service.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={handleCTA}>
                {user ? 'Start Booking Now' : 'Get Started Free'}
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="hero-right animate-slide-right">
            <div className="glass-card form-card">
              <div className="form-header">
                <h3>Book a Repair</h3>
                <p>Get your issue fixed today</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="service">Service Type</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a service...</option>
                    <option value="plumbing">🔧 Plumbing</option>
                    <option value="electrical">⚡ Electrical</option>
                    <option value="furniture">🛋️ Furniture Repair</option>
                    <option value="appliance">🍽️ Appliance Repair</option>
                    <option value="locksmith">🔐 Locksmith</option>
                    <option value="cleaning">✨ Cleaning</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Problem Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe what needs to be fixed..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg full-width">
                  Continue to Sign Up
                </button>
              </form>

              <p className="form-footer">No credit card required • Instant confirmation</p>
            </div>
          </div>
        </div>

        {/* Floating Background Elements */}
        <div className="hero-bg-element hero-bg-1"></div>
        <div className="hero-bg-element hero-bg-2"></div>
      </div>
    </section>
  );
}
