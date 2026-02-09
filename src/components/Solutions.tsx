import './Solutions.css'

export default function Solutions() {
  return (
    <section className="solutions">
      <div className="container">
        <h2 className="section-title">Powerful Features for TVET Excellence</h2>

        <div className="solutions-grid">
          <div className="solution-card solution-card-1">
            <div className="solution-header">
              <div className="icon-circle">📖</div>
              <h3>Digital Library</h3>
              <span className="badge-small">Your Learning Hub</span>
            </div>
            <div className="amount">1000+</div>
            <h4>Curated Resources</h4>
            <p>
              Browse a marketplace of notes, schemes of work, and lesson plans.
              Students can read online previews and download materials
              for offline study whenever needed.
            </p>
            <button className="btn-small">Browse Resources</button>
          </div>

          <div className="solution-card solution-card-2">
            <div className="solution-header">
              <div className="icon-circle">📊</div>
              <h3>Educator Dashboard</h3>
              <p className="subtitle">Manage and monetize your content</p>
            </div>
            <button className="btn-unlock">📈 Track Analytics</button>

            <div className="simple-bill">
              <h4>Performance Analytics</h4>
              <p>
                Monitor revenue growth, unit sales, and resource ratings
                with data visualization. Get insights to improve your
                educational offerings and grow your earnings.
              </p>
              <button className="btn-small">Start Selling</button>
            </div>
          </div>

          <div className="solution-card solution-card-3">
            <h3>Secure Payments</h3>
            <div className="crypto-display">
              <div className="crypto-item">
                <span className="amount-large">M-Pesa</span>
                <span className="crypto-label">Express STK</span>
              </div>
              <div className="crypto-item">
                <span className="amount-large">Card</span>
                <span className="crypto-label">Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
