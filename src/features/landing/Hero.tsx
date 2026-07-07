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
            <button className="badge">Empowering Kenyan Educators</button>
            <h1 className="hero-title">Share, Discover &<br />Download CBET Resources</h1>
            <p className="hero-description">
              Kenya's largest free library of verified lesson plans, notes, and assessments —
              built by TVET trainers, for TVET trainers. Download ready-to-use materials and
              spend less time planning, more time teaching.
            </p>
            <div className="hero-buttons">
              <a href="#resources" className="btn-primary">Start Browsing Free</a>
              <TrainerCTA
                variant="secondary"
                label="Become a Trainer"
                onSignupClick={() => openSignup('hero')}
              />
            </div>
            <div className="hero-trust">
              <span className="trust-badge">Used by educators across Kenya</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-visual">
              <div className="hero-photo-frame">
                <img
                  src="/images/hero-photo.png"
                  alt="TVET student working with tools"
                  className="hero-photo"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat">
            <div className="stat-value">1,200+</div>
            <div className="stat-label">Resources Downloaded</div>
          </div>
          <div className="stat">
            <div className="stat-value">50+</div>
            <div className="stat-label">Active TVET Trainers</div>
          </div>
          <div className="stat">
            <div className="stat-value">4.3★</div>
            <div className="stat-label">Average Resource Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}

