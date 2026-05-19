import './ServicesSection.css';

export default function ServicesSection() {
  const services = [
    { id: 1, icon: '🔧', name: 'Plumbing', description: 'Repairs, installations, and maintenance' },
    { id: 2, icon: '⚡', name: 'Electrical Work', description: 'Safe and reliable electrical solutions' },
    { id: 3, icon: '🛋️', name: 'Furniture Repair', description: 'Fix or refinish your furniture' },
    { id: 4, icon: '🎨', name: 'Painting & Decorating', description: 'Fresh paint and design updates' },
    { id: 5, icon: '🍽️', name: 'Appliance Repair', description: 'Get your appliances working again' },
    { id: 6, icon: '🔐', name: 'Locksmith', description: 'Lock repairs and installations' },
    { id: 7, icon: '🪓', name: 'Carpentry', description: 'Custom woodwork and repairs' },
    { id: 8, icon: '✨', name: 'Cleaning', description: 'Professional cleaning services' },
    { id: 9, icon: '🧱', name: 'Tiling', description: 'Tile installation and repairs' },
    { id: 10, icon: '🔥', name: 'Boiler Service', description: 'Maintenance and repair services' },
    { id: 11, icon: '🏠', name: 'Roof Repair', description: 'Fix leaks and damage' },
    { id: 12, icon: '🪟', name: 'Window Repair', description: 'Glass and frame repairs' },
    { id: 13, icon: '⬜', name: 'Floor Installation', description: 'New floors and refinishing' },
    { id: 14, icon: '🌿', name: 'Garden & Landscaping', description: 'Outdoor space solutions' },
    { id: 15, icon: '🐛', name: 'Pest Control', description: 'Professional pest management' },
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
