import './TrainersHub.css'

export default function TrainersHub() {
  return (
    <section id="trainers-hub" className="trainers-hub">
      <div className="container">
        <div className="trainers-content">
          <div className="trainers-left">
            <div className="section-head align-left">
              <span className="section-kicker">For Trainers</span>
              <h2 className="section-title">Turn Training Into Impact</h2>
              <p className="section-subtitle">
                Create a Trainer account, choose your department, and upload CBET resources.
                Every submission is reviewed by admin before it is published for everyone
                to access. Pricing will be added by admin later.
              </p>
            </div>
            <div className="trainers-actions">
              <a className="btn-primary" href="#signup">Create Trainer Account</a>
              <a className="btn-secondary" href="#resources">Browse Resources</a>
            </div>
          </div>

          <div className="trainers-right">
            <div className="trainers-card">
              <h3>Trainer Highlights</h3>
              <ul>
                <li>Upload lesson plans, notes, and schemes of work by department</li>
                <li>All resources are reviewed and approved by admin before publishing</li>
                <li>Admin manages published resources and adds pricing later</li>
              </ul>
            </div>
            <div className="trainers-metrics">
              <div className="metric">
                <span className="metric-value">1k+</span>
                <span className="metric-label">Active trainers</span>
              </div>
              <div className="metric">
                <span className="metric-value">10k+</span>
                <span className="metric-label">Resources reviewed</span>
              </div>
              <div className="metric">
                <span className="metric-value">Admin</span>
                <span className="metric-label">Pricing coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
