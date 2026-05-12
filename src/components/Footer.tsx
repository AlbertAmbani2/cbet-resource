import { Mail, Users, X } from 'lucide-react'
import { useTrainerSignup } from '../features/TrainerOnboarding'
import './Footer.css'

export default function Footer() {
  const { openSignup } = useTrainerSignup()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">cbet-resource</h3>
            <p className="footer-description">
              Empowering TVET education in Kenya by supporting Trainers
              with admin-reviewed digital learning resources.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Email">
                <Mail aria-hidden="true" />
              </a>
              <a href="#" className="social-icon" aria-label="X">
                <X aria-hidden="true" />
              </a>
              <a href="#" className="social-icon" aria-label="Community">
                <Users aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#faq">About Us</a></li>
              <li><a href="#resources">Resources</a></li>
              <li><a href="#trainers-hub">For Trainers</a></li>
              <li><a href="#hero">Home</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Trainers</h4>
            <ul>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => openSignup('footer')}
                >
                  Create Account
                </button>
              </li>
              <li><a href="#how-it-works">Upload by Department</a></li>
              <li><a href="#how-it-works">Admin Review Process</a></li>
              <li><a href="#resources">Browse Resources</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => openSignup('footer')}
                >
                  Sign Up
                </button>
              </li>
              <li><a href="#resources">Resources</a></li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => openSignup('footer')}
                >
                  Become Trainer
                </button>
              </li>
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


