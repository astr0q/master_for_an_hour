import './ServicesSection.css';

export default function ServicesSection() {
  const services = [
    { id: 1, icon: '🔧', name: 'Plumbing', description: 'Repairs, installations, and maintenance' },
    { id: 2, icon: '⚡', name: 'Electrical Work', description: 'Safe and reliable electrical solutions' },
    { id: 6, icon: '🔐', name: 'Locksmith', description: 'Lock repairs and installations' },
    { id: 11, icon: '🏠', name: 'Roof Repair', description: 'Fix leaks and damage' },
  ];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>Professional solutions for all your home repair needs</p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card premium-card">
              <div className="service-icon-wrapper">
                <div className="service-icon-bg"></div>
                <span className="service-icon-large">{service.icon}</span>
              </div>
              <h4 className="service-name">{service.name}</h4>
              <p className="service-description">{service.description}</p>
              <div className="service-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
