import { Suspense, lazy } from 'react'
import './Hero.css'
import TrainerCTA from '../onboarding/CTAs/TrainerCTA'
import { useTrainerSignup } from '../onboarding/hooks/useTrainerSignup'

const SparklesCore = lazy(() =>
  import('../../components/ui/sparkles').then(m => ({ default: m.SparklesCore }))
)

export default function Hero() {
  const { openSignup } = useTrainerSignup()
  return (
    <section id="hero" className="hero">
      <div className="hero-particles">
        <Suspense fallback={<div className="w-full h-full" />}>
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
        </Suspense>
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
              <TrainerCTA
                variant="secondary"
                label="Become a Trainer"
                onSignupClick={() => openSignup('hero')}
              />
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

