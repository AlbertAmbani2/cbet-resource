import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">cbet-resource</h3>
            <p className="footer-description">
              Empowering TVET education in Kenya by connecting educators
              with students through quality digital learning resources.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">📧</a>
              <a href="#" className="social-icon">𝕏</a>
              <a href="#" className="social-icon">👥</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#mission">Our Mission</a></li>
              <li><a href="#impact">Impact</a></li>
              <li><a href="#team">Team</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Users</h4>
            <ul>
              <li><a href="#for-students">For Students</a></li>
              <li><a href="#for-educators">For Educators</a></li>
              <li><a href="#resources">Browse Resources</a></li>
              <li><a href="#dashboard">Dashboard</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#guides">Guides</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section newsletter">
            <h4>Stay Updated</h4>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>Copyright cbet-resource. All rights reserved | Empowering TVET Education in Kenya</p>
        </div>
      </div>
    </footer>
  )
}
