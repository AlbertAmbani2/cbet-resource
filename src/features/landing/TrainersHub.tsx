import { User, Upload, ShieldCheck, TrendingUp } from 'lucide-react'
import './TrainersHub.css'
import TrainerCTAGroup from '../onboarding/CTAs/TrainerCTAGroup'
import { useTrainerSignup } from '../onboarding/hooks/useTrainerSignup'
import { TRAINER_ONBOARDING } from '../../config/trainerOnboarding'

export default function TrainersHub() {
  const { openSignup } = useTrainerSignup()

  const steps = [
    { icon: <User size={20} />, title: 'Create an Account', desc: 'Register as a Trainer and select your department.' },
    { icon: <Upload size={20} />, title: 'Upload Resources', desc: 'Submit lesson plans, notes, and schemes of work for review.' },
    { icon: <ShieldCheck size={20} />, title: 'Admin Review & Publish', desc: 'Admin approves content before it appears for everyone to browse.' },
  ]

  return (
    <section id="trainers-hub" className="trainers-hub">
      <div className="container">
        <div className="trainers-content">
          <div className="trainers-left">
            <div className="section-head align-left">
              <span className="section-kicker">For Trainers</span>
              <h2 className="section-title">Turn Training Into Impact</h2>
              <p className="section-subtitle">
                {TRAINER_ONBOARDING.primaryCTA.description}
              </p>
            </div>

            <div className="trainer-process">
              {steps.map((step, i) => (
                <div key={i} className="trainer-step">
                  <span className="trainer-step-num">{i + 1}</span>
                  <div className="trainer-step-icon">{step.icon}</div>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="trainers-actions">
              <TrainerCTAGroup
                primaryLabel={TRAINER_ONBOARDING.primaryCTA.label}
                onPrimaryClick={() => openSignup('trainers-hub')}
              />
            </div>
          </div>

          <div className="trainers-right">
            <div className="trainers-card">
              <h3>What you get</h3>
              <ul>
                <li>Upload resources by department</li>
                <li>Admin reviews before publishing</li>
                <li>Reach verified learners nationwide</li>
                <li>Pricing managed by admin</li>
              </ul>
            </div>

            <div className="trainers-card">
              <h3>Platform metrics</h3>
              <div className="trainers-metrics">
                <div className="metric">
                  <TrendingUp size={20} className="metric-icon" />
                  <span className="metric-value">30+</span>
                  <span className="metric-label">Resources</span>
                </div>
                <div className="metric">
                  <TrendingUp size={20} className="metric-icon" />
                  <span className="metric-value">10+</span>
                  <span className="metric-label">Trainers</span>
                </div>
                <div className="metric">
                  <TrendingUp size={20} className="metric-icon" />
                  <span className="metric-value">1-Day</span>
                  <span className="metric-label">Review SLA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
