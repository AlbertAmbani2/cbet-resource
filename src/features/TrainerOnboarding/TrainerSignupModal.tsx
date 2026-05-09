/**
 * TrainerOnboarding Modal
 * Displays trainer signup form in a modal overlay
 * Uses global context for state management
 */

import { useTrainerSignupContext } from './TrainerSignupContext'
import { TRAINER_SIGNUP_FLOW, TRAINER_ONBOARDING } from '../../config/trainerOnboarding'
import './TrainerOnboarding.css'

export function TrainerSignupModal() {
  const { isOpen, currentStep, formData, isLoading, error, success, isExistingUser, closeSignup, nextStep, prevStep, updateFormData, submitForm, clearError, setSignupError } = useTrainerSignupContext()

  if (!isOpen) return null

  // TESTING: Disable email verification requirement
  // TODO: Re-enable verification in production
  const requiresVerification = import.meta.env.VITE_REQUIRE_EMAIL_VERIFICATION === 'true'
  const maxStep = requiresVerification ? 3 : 2 // Skip verification step (index 3) in testing mode
  const step = TRAINER_SIGNUP_FLOW.steps[currentStep]
  const isLastStep = currentStep === maxStep

  const handleNext = () => {
    // Validate current step before moving
    if (step === 'account') {
      if (!formData.email) {
        setSignupError('Email is required')
        return
      }
      if (!formData.password) {
        setSignupError('Password is required')
        return
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setSignupError('Email format is invalid')
        return
      }
    }
    if (step === 'profile' && !formData.fullName) {
      setSignupError('Full name is required')
      return
    }
    if (step === 'department' && !formData.department) {
      setSignupError('Department is required')
      return
    }
    clearError()
    nextStep()
  }

  const handleSubmit = async () => {
    await submitForm()
  }

  const handleGoToSignIn = () => {
    closeSignup()
    window.location.hash = '#signin'
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
          {TRAINER_SIGNUP_FLOW.steps.map((s, idx) => {
            // Skip verification step (index 3) in testing mode
            if (!requiresVerification && idx > maxStep) return null
            return (
              <div key={s} className={`progress-step ${idx <= currentStep ? 'active' : ''}`}>
                <div className="step-number">{idx + 1}</div>
              </div>
            )
          })}
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Error Message */}
          {error && (
            <div className="modal-error" role="alert">
              <div className="error-content">
                <span>⚠️ {error}</span>
                <button 
                  className="error-close" 
                  onClick={clearError}
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
              {isExistingUser && (
                <div className="error-action">
                  <p>This email is already registered.</p>
                  <button className="btn-primary" onClick={handleGoToSignIn}>
                    Go to Sign In
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="modal-success" role="status">
              <div className="success-content">
                <span>✓ Account created successfully!</span>
                <p className="success-subtext">
                  {requiresVerification
                    ? 'Check your email to verify your account.'
                    : 'Your account is ready. Sign in to continue.'}
                </p>
                {!requiresVerification && (
                  <button className="btn-primary" onClick={handleGoToSignIn}>
                    Go to Sign In
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="modal-loading">
              <div className="spinner" />
              <p>Creating your account...</p>
            </div>
          )}

          {!isLoading && !success && (
            <>
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

          {/* Verification Step (Only shown if email verification required) */}
          {requiresVerification && step === 'verification' && (
            <div className="form-step verification-step">
              <p>Check your email to verify your account.</p>
              <p>Click the verification link to complete signup.</p>
            </div>
          )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="modal-footer">
            <button
              className="btn-secondary"
              onClick={prevStep}
              disabled={currentStep === 0 || isLoading}
              aria-label="Go to previous step"
            >
              Back
            </button>
            {!isLastStep ? (
              <button 
                className="btn-primary" 
                onClick={handleNext}
                disabled={isLoading}
                aria-label="Go to next step"
              >
                Next
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={isLoading}
                aria-label="Complete signup"
              >
                {isLoading ? 'Creating...' : 'Complete Setup'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
