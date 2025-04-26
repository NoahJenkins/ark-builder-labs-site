import { Link } from 'react-router-dom';
import './Pages.css';

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Transforming Ideas into Digital Reality</h1>
          <p className="lead">
            Ark Builder Labs specializes in Full Stack Web Development, Azure Infrastructure, 
            and Technical Consulting for businesses of all sizes.
          </p>
          <div className="hero-buttons">
            <Link to="/contact" className="btn btn-primary">Get Started</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2 className="text-center">Our Services</h2>
          <div className="grid services">
            <div className="card">
              <h3>Full Stack Development</h3>
              <p>
                From responsive front-end interfaces to robust back-end systems, 
                we create custom web applications tailored to your specific needs.
              </p>
            </div>
            <div className="card">
              <h3>Azure Infrastructure</h3>
              <p>
                Leverage the power of Microsoft Azure with our expert implementation, 
                migration, and management services for scalable cloud solutions.
              </p>
            </div>
            <div className="card">
              <h3>Technical Consulting</h3>
              <p>
                Navigate complex technical decisions with confidence using our 
                strategic consulting services backed by years of industry experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <h2 className="text-center">Why Choose Us</h2>
          <div className="features">
            <div className="feature">
              <h3>Expert Team</h3>
              <p>
                Our team of certified professionals brings decades of combined 
                experience across various technology domains.
              </p>
            </div>
            <div className="feature">
              <h3>Tailored Solutions</h3>
              <p>
                We don't believe in one-size-fits-all. Every solution we deliver 
                is customized to address your unique challenges.
              </p>
            </div>
            <div className="feature">
              <h3>Ongoing Support</h3>
              <p>
                Our relationship doesn't end at deployment. We provide continuous 
                support to ensure your technology evolves with your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <h2>Ready to Transform Your Digital Presence?</h2>
          <p>
            Let's discuss how Ark Builder Labs can help you achieve your technology goals.
          </p>
          <Link to="/contact" className="btn btn-primary">Contact Us Today</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
