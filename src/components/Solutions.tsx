import { BarChart3, TrendingUp } from 'lucide-react'
import './Solutions.css'

export default function Solutions() {
  return (
    <section id="resources" className="solutions">
      <div className="container">
        <div className="section-head">
          <span className="section-kicker">Outcomes</span>
          <h2 className="section-title">Built Around Trainer Success</h2>
          <p className="section-subtitle">
            Department-based uploads, admin review, and open browsing for everyone.
          </p>
        </div>

        <div className="solutions-grid">
          <div className="solution-card solution-card-2">
            <div className="solution-header">
              <div className="icon-circle">
                <BarChart3 aria-hidden="true" />
              </div>
              <h3>Publish With Confidence</h3>
              <p className="subtitle">For Trainers</p>
            </div>
            <button className="btn-unlock">
              <TrendingUp aria-hidden="true" />
              <span>Track Review Status</span>
            </button>

            <div className="simple-bill">
              <h4>Admin-Reviewed Content</h4>
              <p>
                Upload resources by department. Admin reviews every submission
                before it is published, and will add pricing later.
              </p>
              <a href="#signup" className="btn-small">Create Trainer Account</a>
            </div>
          </div>

          <div className="solution-card solution-card-3">
            <h3>Open Access Browsing</h3>
            <div className="crypto-display">
              <div className="crypto-item">
                <span className="amount-large">No Sign-In</span>
                <span className="crypto-label">Browse Resources</span>
              </div>
              <div className="crypto-item">
                <span className="amount-large">Admin Managed</span>
                <span className="crypto-label">Publishing & Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
