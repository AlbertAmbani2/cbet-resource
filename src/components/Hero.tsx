import './Hero.css'
import { SparklesCore } from './ui/sparkles'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-particles">
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#3b5bdb"
          speed={2}
        />
      </div>
      <div className="hero-background"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-left">
            <button className="badge">Find Verified Learning Materials</button>
            <h1 className="hero-title">Find Quality CBET<br />Resources in Seconds</h1>
            <p className="hero-description">
              Browse 30+ verified lesson plans, notes, and assessments from experienced educators.
              Download PDFs for free and use them offline. No login required to get started.
            </p>
            <div className="hero-buttons">
              <a href="#resources" className="btn-primary">Browse Now</a>
              <a href="#trainers-hub" className="btn-secondary">Become a Trainer</a>
            </div>
          </div>

          <div className="hero-right">
            <img src="/images/hero-image.png" alt="Browse CBET Resources" className="hero-image" />
          </div>
        </div>

        <div className="stats-section">
          <div className="stat">
            <div className="stat-value">30+</div>
            <div className="stat-label">Verified Resources</div>
          </div>
          <div className="stat">
            <div className="stat-value">10+ Trainers</div>
            <div className="stat-label">Expert Educators</div>
          </div>
          <div className="stat">
            <div className="stat-value">1-Day SLA</div>
            <div className="stat-label">Resource Review Guarantee</div>
          </div>
        </div>
      </div>
    </section>
  )
}

