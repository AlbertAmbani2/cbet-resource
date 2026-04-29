/**
 * TrainerOnboarding Modal
 * Displays trainer signup form in a modal overlay
 * Uses global context for state management
 */

import { useTrainerSignupContext } from './TrainerSignupContext'
import { TRAINER_SIGNUP_FLOW, TRAINER_ONBOARDING } from '../../config/trainerOnboarding'
import './TrainerOnboarding.css'

export function TrainerSignupModal() {
  const { isOpen, currentStep, formData, closeSignup, nextStep, prevStep, updateFormData, submitForm } = useTrainerSignupContext()

  if (!isOpen) return null

  const step = TRAINER_SIGNUP_FLOW.steps[currentStep]
  const isLastStep = currentStep === TRAINER_SIGNUP_FLOW.steps.length - 1

  const handleNext = () => {
    // Validate current step before moving
    if (step === 'account' && (!formData.email || !formData.password)) {
      alert('Please enter email and password')
      return
    }
    if (step === 'profile' && !formData.fullName) {
      alert('Please enter your full name')
      return
    }
    if (step === 'department' && !formData.department) {
      alert('Please select a department')
      return
    }
    nextStep()
  }

  const handleSubmit = () => {
    submitForm()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="trainer-modal-backdrop" onClick={closeSignup} />

      {/* Modal */}
      <div className="trainer-modal" role="dialog" aria-labelledby="modal-title">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title">{TRAINER_ONBOARDING.signupModal.title}</h2>
          <button className="modal-close" onClick={closeSignup} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="modal-progress">
          {TRAINER_SIGNUP_FLOW.steps.map((s, idx) => (
            <div key={s} className={`progress-step ${idx <= currentStep ? 'active' : ''}`}>
              <div className="step-number">{idx + 1}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="modal-content">
          <div className="modal-step-label">
            {TRAINER_SIGNUP_FLOW.stepLabels[step]}
          </div>

          {/* Account Step (Email + Password) */}
          {step === 'account' && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => updateFormData('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={e => updateFormData('password', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Profile Step */}
          {step === 'profile' && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={e => updateFormData('fullName', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Department Step */}
          {step === 'department' && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={e => updateFormData('department', e.target.value)}
                >
                  <option value="">Select your department...</option>
                  {TRAINER_SIGNUP_FLOW.departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Verification Step */}
          {step === 'verification' && (
            <div className="form-step verification-step">
              <p>Check your email to verify your account.</p>
              <p>Click the verification link to complete signup.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Back
          </button>
          {!isLastStep ? (
            <button className="btn-primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit}>
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </>
  )
}
