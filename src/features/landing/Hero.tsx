import { Suspense, lazy } from 'react'
import './Hero.css'
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
            <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-6">
              Empowering Kenyan Educators
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
              Share, Discover & Download <span className="text-emerald-600">CBET Resources</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              Kenya's largest free library of verified lesson plans, notes, and assessments —
              built by TVET trainers, for TVET trainers. Download ready-to-use materials and
              spend less time planning, more time teaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#resources"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 text-center"
              >
                Start Browsing Free
              </a>
              <button
                onClick={() => openSignup('hero')}
                className="border border-slate-300 hover:border-slate-400 text-slate-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200 text-center"
              >
                Become a Trainer
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-4 tracking-wide font-medium">
              Used by educators across Kenya
            </p>
          </div>

          <div className="hero-right">
            <div className="w-full flex items-center justify-center p-4 md:p-6">
              <div className="relative group w-full max-w-[460px] lg:max-w-[520px]">
                <img
                  src="/images/hero4.jpg"
                  alt="TVET student working with tools"
                  className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
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

