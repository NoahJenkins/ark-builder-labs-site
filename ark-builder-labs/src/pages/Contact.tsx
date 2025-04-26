import { useState } from 'react';
import './Pages.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally handle the form submission to a backend
    console.log(formData);
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="lead">
            Get in touch with our team to discuss your project
          </p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Reach Out to Us</h2>
              <p>
                Whether you have a question about our services, need a quote, or 
                want to discuss a potential project, our team is here to help.
              </p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <h3>Email</h3>
                  <p>info@arkbuilderlabs.com</p>
                </div>
                
                <div className="contact-method">
                  <h3>Phone</h3>
                  <p>(123) 456-7890</p>
                </div>
                
                <div className="contact-method">
                  <h3>Office</h3>
                  <p>
                    123 Tech Boulevard<br />
                    Suite 101<br />
                    San Francisco, CA 94105
                  </p>
                </div>
                
                <div className="contact-method">
                  <h3>Hours</h3>
                  <p>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              {formSubmitted ? (
                <div className="form-success">
                  <h2>Thank you for contacting us!</h2>
                  <p>We've received your message and will get back to you shortly.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setFormSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2>Send Us a Message</h2>
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Name*</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject">Subject*</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Azure Infrastructure">Azure Infrastructure</option>
                        <option value="Technical Consulting">Technical Consulting</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">Message*</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section map-section">
        <div className="container">
          <h2 className="text-center">Find Us</h2>
          <div className="map-placeholder">
            {/* Placeholder for Google Maps integration */}
            <div className="map-image">Map goes here</div>
            <p className="text-center">
              Interactive map would be integrated here in production
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
