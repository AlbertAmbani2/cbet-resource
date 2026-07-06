import { BookOpen } from 'lucide-react'
import TrainerCTAGroup from './CTAs/TrainerCTAGroup'
import { TRAINER_ONBOARDING, TRAINER_SIGNUP_FLOW } from '../../config/trainerOnboarding'
import { useTrainerSignup } from './hooks/useTrainerSignup'
import './TrainerOnboarding.css'

export default function TrainerOnboarding() {
  const signup = useTrainerSignup()

  return (
    <section id="trainer-onboarding" className="trainer-onboarding">
      <TrainerOnboarding.Preview
        onSignupClick={() => signup.openSignup('preview')}
      />
    </section>
  )
}

/**
 * Preview: Compact summary section for landing page
 */
TrainerOnboarding.Preview = function TrainerOnboardingPreview({
  onSignupClick
}: {
  onSignupClick: () => void
}) {
  return (
    <div className="trainer-onboarding-preview">
      <div className="preview-content">
        <div className="preview-left">
          <h2 className="preview-title">Turn Training Into Impact</h2>
          <p className="preview-subtitle">
            {TRAINER_ONBOARDING.primaryCTA.description}
          </p>

          <ul className="preview-features">
            {TRAINER_ONBOARDING.primaryCTA.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>

          <TrainerCTAGroup
            primaryLabel={TRAINER_ONBOARDING.primaryCTA.label}
            onPrimaryClick={onSignupClick}
          />
        </div>

        <div className="preview-right">
          <div className="preview-illustration">
            <div className="illustration-circle">
              <div className="illustration-icon"><BookOpen size={32} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Step-by-step form for full signup flow
 */
TrainerOnboarding.Form = function TrainerOnboardingForm() {
  const signup = useTrainerSignup()
  const currentStep = TRAINER_SIGNUP_FLOW.steps[signup.currentStep]

  return (
    <div className="trainer-form">
      {/* Step indicator */}
      <div className="form-progress">
        {TRAINER_SIGNUP_FLOW.steps.map((step, idx) => (
          <div
            key={step}
            className={`progress-step ${idx <= signup.currentStep ? 'active' : ''}`}
          >
            <div className="step-number">{idx + 1}</div>
            <div className="step-label">{TRAINER_SIGNUP_FLOW.stepLabels[step]}</div>
          </div>
        ))}
      </div>

      {/* Form content */}
      <div className="form-content">
        {currentStep === 'account' && (
          <div className="form-step">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={signup.formData.email}
              onChange={e => signup.updateFormData('email', e.target.value)}
            />
            <label style={{ marginTop: 16 }}>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={signup.formData.password}
              onChange={e => signup.updateFormData('password', e.target.value)}
            />
          </div>
        )}

        {currentStep === 'profile' && (
          <div className="form-step">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={signup.formData.fullName}
              onChange={e => signup.updateFormData('fullName', e.target.value)}
            />
          </div>
        )}

        {currentStep === 'department' && (
          <div className="form-step">
            <label>Department</label>
            <select
              value={signup.formData.department}
              onChange={e => signup.updateFormData('department', e.target.value)}
            >
              <option value="">Select your department</option>
              {TRAINER_SIGNUP_FLOW.departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        )}

        {currentStep === 'verification' && (
          <div className="form-step">
            <p>Review your information before submitting</p>
            <div className="review-summary">
              <p><strong>Email:</strong> {signup.formData.email}</p>
              <p><strong>Name:</strong> {signup.formData.fullName}</p>
              <p><strong>Department:</strong> {signup.formData.department}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="form-actions">
        {signup.currentStep > 0 && (
          <button onClick={signup.prevStep} className="btn-prev">
            Back
          </button>
        )}
        {signup.currentStep < TRAINER_SIGNUP_FLOW.steps.length - 1 && (
          <button onClick={signup.nextStep} className="btn-next">
            Next
          </button>
        )}
        {signup.currentStep === TRAINER_SIGNUP_FLOW.steps.length - 1 && (
          <button onClick={signup.submitForm} className="btn-submit">
            Create Account
          </button>
        )}
      </div>
    </div>
  )
}
