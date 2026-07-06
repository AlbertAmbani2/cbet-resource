import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, AlertTriangle, CircleCheckBig, Eye, EyeOff, Laptop, Briefcase, Car, Hotel, HardHat, Plane, Palmtree, Stethoscope, Users } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { TRAINER_SIGNUP_FLOW, TRAINER_ONBOARDING } from '../../config/trainerOnboarding'
import './TrainerOnboarding.css'

const DEPARTMENT_ICONS: Record<string, React.ReactNode> = {
  'ICT': <Laptop size={22} />,
  'Business': <Briefcase size={22} />,
  'Automotive': <Car size={22} />,
  'Hospitality': <Hotel size={22} />,
  'Construction': <HardHat size={22} />,
  'Tourism': <Plane size={22} />,
  'Agriculture': <Palmtree size={22} />,
  'Health': <Stethoscope size={22} />,
  'Other': <Users size={22} />,
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' }
  if (score <= 3) return { score, label: 'Medium', color: '#f59e0b' }
  return { score, label: 'Strong', color: '#10b981' }
}

interface FieldErrors {
  email?: string
  password?: string
  fullName?: string
  department?: string
}

export function TrainerSignupModal() {
  const navigate = useNavigate()
  const { isOpen, formData, isLoading, error, success, isExistingUser, closeAuth, updateFormData, submitForm, clearError } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<FieldErrors>({})

  if (!isOpen) return null

  const strength = getPasswordStrength(formData.password)

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {}
    if (!formData.email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format'

    if (!formData.password) errs.password = 'Password is required'
    else if (formData.password.length < 8) errs.password = 'At least 8 characters'

    if (!formData.fullName) errs.fullName = 'Full name is required'

    if (!formData.department) errs.department = 'Select a department'
    return errs
  }

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    updateFormData(field, value)
    if (touched[field]) {
      const newErrors = validate()
      setErrors(prev => ({ ...prev, [field]: newErrors[field as keyof FieldErrors] }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const newErrors = validate()
    setErrors(prev => ({ ...prev, [field]: newErrors[field as keyof FieldErrors] }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    setTouched({ email: true, password: true, fullName: true, department: true })
    if (Object.keys(newErrors).length > 0) return
    await submitForm()
  }

  const handleGoToSignIn = () => {
    closeAuth()
    navigate('/signin')
  }

  return (
    <>
      <div className="trainer-modal-backdrop" onClick={closeAuth} />
      <div className="trainer-modal" role="dialog" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">{TRAINER_ONBOARDING.signupModal.title}</h2>
          <button className="modal-close" onClick={closeAuth} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="modal-error" role="alert">
              <div className="error-content">
                <AlertTriangle size={16} />
                <span>{error}</span>
                <button className="error-close" onClick={clearError} aria-label="Dismiss error">
                  <X size={14} />
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

          {success && (
            <div className="modal-success" role="status">
              <div className="success-content">
                <CircleCheckBig size={20} />
                <span>Account created successfully!</span>
                <p className="success-subtext">Your account is ready. Sign in to continue.</p>
                <button className="btn-primary" onClick={handleGoToSignIn}>
                  Go to Sign In
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="modal-loading">
              <div className="spinner" />
              <p>Creating your account...</p>
            </div>
          )}

          {!isLoading && !success && (
            <form className="signup-form" onSubmit={handleSubmit} noValidate>
              <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={e => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={e => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
                {formData.password && (
                  <div className="strength-meter">
                    <div
                      className="strength-bar"
                      style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color }}
                    />
                    <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className={`form-group ${errors.fullName ? 'has-error' : ''}`}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={e => handleFieldChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className={`form-group ${errors.department ? 'has-error' : ''}`}>
                <label>Department</label>
                <div className="dept-grid">
                  {TRAINER_SIGNUP_FLOW.departments.map(dept => (
                    <button
                      key={dept}
                      type="button"
                      className={`dept-card ${formData.department === dept ? 'selected' : ''}`}
                      onClick={() => {
                        updateFormData('department', dept)
                        setTouched(prev => ({ ...prev, department: true }))
                        setErrors(prev => ({ ...prev, department: undefined }))
                      }}
                    >
                      <span className="dept-card-icon">{DEPARTMENT_ICONS[dept]}</span>
                      <span className="dept-card-name">{dept}</span>
                    </button>
                  ))}
                </div>
                {errors.department && <span className="field-error">{errors.department}</span>}
              </div>

              <button type="submit" className="btn-primary btn-submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>

              <p className="form-footer-text">
                Already have an account?{' '}
                <button type="button" className="link-btn" onClick={handleGoToSignIn}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
