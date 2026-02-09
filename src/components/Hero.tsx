import './Hero.css'
import CardGradient from './CardGradient'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-left">
            <button className="badge">TVET Educational Excellence</button>
            <h1 className="hero-title">Quality Resources,<br />Empowered Learning</h1>
            <p className="hero-description">
              cbet-resource bridges the gap between educators and students with a scalable
              digital marketplace for CBET-aligned academic resources in Kenya.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Explore Resources</button>
              <button className="btn-secondary">Start Teaching</button>
            </div>
          </div>

          <div className="hero-right">
            <CardGradient />
          </div>
        </div>

        <div className="stats-section">
          <div className="stat">
            <div className="stat-value">100%</div>
            <div className="stat-label">Secure & Verified</div>
          </div>
          <div className="stat">
            <div className="stat-value">10k+ Resources</div>
            <div className="stat-label">CBET-Aligned Materials</div>
          </div>
          <div className="stat">
            <div className="stat-value">1k+ Educators</div>
            <div className="stat-label">Share Their Expertise</div>
          </div>
        </div>
      </div>
    </section>
  )
}
