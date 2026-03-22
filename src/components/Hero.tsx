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
            <button className="badge">TVET Educational Excellence</button>
            <h1 className="hero-title">Quality Resources,<br />Empowered Learning</h1>
            <p className="hero-description">
              cbet-resource empowers Trainers with department-based uploads and admin-reviewed
              publishing for CBET-aligned resources in Kenya. Anyone can browse resources
              without signing in.
            </p>
            <div className="hero-buttons">
              <a href="#resources" className="btn-primary">Explore Resources</a>
              <a href="#trainers-hub" className="btn-secondary">Become a Trainer</a>
            </div>
          </div>

          <div className="hero-right">
            <img src="/images/hero-image.png" alt="Hero" className="hero-image" />
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
            <div className="stat-value">Admin Reviewed</div>
            <div className="stat-label">Resources Verified Before Publish</div>
          </div>
        </div>
      </div>
    </section>
  )
}

