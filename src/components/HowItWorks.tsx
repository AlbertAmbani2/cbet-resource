import { User } from 'lucide-react'
import './HowItWorks.css'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="section-head">
          <span className="section-kicker">How It Works</span>
          <h2 className="section-title">Simple Steps, Clear Outcomes</h2>
          <p className="section-subtitle">
            Trainers upload by department, admin reviews, and everyone can browse.
          </p>
        </div>

        <div className="flows-grid">
          <div className="flow-card">
            <div className="flow-header">
              <div className="flow-icon">
                <User aria-hidden="true" />
              </div>
              <h3>For Trainers</h3>
            </div>
            <ol className="flow-steps">
              <li>
                <span className="step-number">1</span>
                <div>
                  <h4>Create an Account</h4>
                  <p>Register as a Trainer and select your department.</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div>
                  <h4>Upload Resources</h4>
                  <p>Submit lesson plans, notes, and schemes of work for review.</p>
                </div>
              </li>
              <li>
                <span className="step-number">3</span>
                <div>
                  <h4>Admin Review & Publish</h4>
                  <p>Admin approves content before it appears for everyone to browse.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
