import './HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Request a Service',
      description: 'Describe your repair needs and choose a time that works for you',
      icon: '📝'
    },
    {
      number: '02',
      title: 'Get Matched',
      description: 'Our system finds the best available master for your job',
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Expert Service',
      description: 'A verified professional arrives and completes your repair',
      icon: '✅'
    },
    {
      number: '04',
      title: 'Review & Pay',
      description: 'Rate the service and pay securely through our platform',
      icon: '⭐'
    },
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-title">
          <h2>How It Works</h2>
          <p>Simple, transparent, and hassle-free</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item animate-fade-in">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">{step.icon}</div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
