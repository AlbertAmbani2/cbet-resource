import { Search } from 'lucide-react'
import './HowItWorks.css'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="section-head">
          <span className="section-kicker">How It Works</span>
          <h2 className="section-title">Browse & Download in Minutes</h2>
          <p className="section-subtitle">
            No account needed. Find CBET-aligned resources by department, preview details, and download.
          </p>
        </div>

        <div className="flows-grid">
          <div className="flow-card">
            <div className="flow-header">
              <div className="flow-icon">
                <Search aria-hidden="true" />
              </div>
              <h3>For Learners & Visitors</h3>
            </div>
            <ol className="flow-steps">
              <li>
                <span className="step-number">1</span>
                <div>
                  <h4>Browse Resources</h4>
                  <p>Explore CBET-aligned materials by department — no account needed.</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div>
                  <h4>Preview & Download</h4>
                  <p>View resource details, ratings, and download published materials.</p>
                </div>
              </li>
              <li>
                <span className="step-number">3</span>
                <div>
                  <h4>Share Feedback</h4>
                  <p>Leave ratings and reviews to help others find quality resources.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
