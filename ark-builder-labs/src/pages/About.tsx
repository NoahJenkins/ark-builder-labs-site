import { Link } from 'react-router-dom';
import './Pages.css';

function About() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>About Ark Builder Labs</h1>
          <p className="lead">
            Leading the way in web development and cloud solutions
          </p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Ark Builder Labs was founded with a simple mission: to help businesses 
                leverage technology to achieve their goals. What began as a small 
                consulting firm has grown into a full-service technology partner 
                for clients across various industries.
              </p>
              <p>
                Our team combines technical expertise with business acumen to deliver 
                solutions that not only solve immediate challenges but also position 
                our clients for future success. We believe in building long-term 
                partnerships based on trust, transparency, and results.
              </p>
            </div>
            <div className="about-image">
              {/* Placeholder for company image */}
              <div className="image-placeholder">Company Image</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <h2 className="text-center">Our Core Values</h2>
          <div className="grid values">
            <div className="value-card">
              <h3>Innovation</h3>
              <p>
                We continuously explore new technologies and approaches to deliver 
                cutting-edge solutions that give our clients a competitive edge.
              </p>
            </div>
            <div className="value-card">
              <h3>Integrity</h3>
              <p>
                We operate with honesty and transparency in all our interactions, 
                building trust with our clients, partners, and team members.
              </p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>
                We are committed to delivering high-quality work that exceeds expectations 
                and stands the test of time.
              </p>
            </div>
            <div className="value-card">
              <h3>Collaboration</h3>
              <p>
                We work closely with our clients, understanding their needs and involving 
                them throughout the development process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section team-section">
        <div className="container">
          <h2 className="text-center">Our Leadership Team</h2>
          <div className="grid team">
            <div className="team-member">
              <div className="member-photo">
                {/* Placeholder for team member photo */}
                <div className="photo-placeholder">Photo</div>
              </div>
              <h3>Jane Smith</h3>
              <p className="position">Founder & CEO</p>
              <p>
                With 15+ years in technology leadership, Jane brings vision and 
                strategic direction to Ark Builder Labs.
              </p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                {/* Placeholder for team member photo */}
                <div className="photo-placeholder">Photo</div>
              </div>
              <h3>John Doe</h3>
              <p className="position">CTO</p>
              <p>
                John leads our technical initiatives with 12 years of experience 
                in cloud architecture and web development.
              </p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                {/* Placeholder for team member photo */}
                <div className="photo-placeholder">Photo</div>
              </div>
              <h3>Sarah Johnson</h3>
              <p className="position">Lead Azure Specialist</p>
              <p>
                Sarah's expertise in Azure infrastructure has helped countless 
                clients optimize their cloud operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <h2>Want to Join Our Team?</h2>
          <p>
            We're always looking for talented individuals to help us deliver 
            exceptional technology solutions.
          </p>
          <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
        </div>
      </section>
    </>
  );
}

export default About;
