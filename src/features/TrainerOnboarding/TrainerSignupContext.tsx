/**
 * TrainerSignup Context
 * Provides global state management for trainer signup modal
 * Ensures all CTA buttons share the same modal instance
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface FormData {
  email: string
  password: string
  fullName: string
  department: string
}

interface TrainerSignupContextType {
  isOpen: boolean
  currentStep: number
  formData: FormData
  isLoading: boolean
  error: string | null
  success: boolean
  isExistingUser: boolean
  openSignup: (source?: string) => void
  closeSignup: () => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (field: keyof FormData, value: string) => void
  submitForm: () => Promise<void>
  clearError: () => void
  setSignupError: (message: string) => void
}

const TrainerSignupContext = createContext<TrainerSignupContextType | undefined>(undefined)

export function TrainerSignupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isExistingUser, setIsExistingUser] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
    department: ''
  })

  const openSignup = useCallback((source?: string) => {
    if (source) {
      console.log(`[Analytics] Trainer signup initiated from: ${source}`)
    }
    setIsOpen(true)
  }, [])

  const closeSignup = useCallback(() => {
    setIsOpen(false)
    // Reset form after closing
    setTimeout(() => {
      setCurrentStep(0)
      setIsLoading(false)
      setError(null)
      setSuccess(false)
      setIsExistingUser(false)
      setFormData({
        email: '',
        password: '',
        fullName: '',
        department: ''
      })
    }, 300)
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setIsExistingUser(false)
  }, [])

  const setSignupError = useCallback((message: string) => {
    setError(message)
    setIsExistingUser(false)
  }, [])

  const submitForm = useCallback(async () => {
    try {
      setError(null)
      setIsExistingUser(false)
      setSuccess(false)
      setIsLoading(true)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      // Call backend API
      const response = await fetch(`${apiUrl}/api/trainers/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          department: formData.department
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Signup failed')
      }

      const data = await response.json()
      console.log('[Trainer Signup] Success:', data)
      setSuccess(true)
      setIsExistingUser(false)

      // TESTING: Disable email verification requirement
      // TODO: Re-enable verification step in production by setting VITE_REQUIRE_EMAIL_VERIFICATION=true
      const requiresVerification = import.meta.env.VITE_REQUIRE_EMAIL_VERIFICATION === 'true'

      if (requiresVerification) {
        setCurrentStep(3) // Move to verification step
      } else {
        console.log('[Trainer Signup] Email verification disabled (testing mode)')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('[Trainer Signup] Error:', errorMessage)
      setError(errorMessage)
      setIsExistingUser(errorMessage.toLowerCase().includes('already registered'))
    } finally {
      setIsLoading(false)
    }
  }, [formData, closeSignup])

  return (
    <TrainerSignupContext.Provider
      value={{
        isOpen,
        currentStep,
        formData,
        isLoading,
        error,
        success,
        isExistingUser,
        openSignup,
        closeSignup,
        nextStep,
        prevStep,
        updateFormData,
        submitForm,
        clearError,
        setSignupError
      }}
    >
      {children}
    </TrainerSignupContext.Provider>
  )
}

export function useTrainerSignupContext() {
  const context = useContext(TrainerSignupContext)
  if (!context) {
    throw new Error('useTrainerSignupContext must be used within TrainerSignupProvider')
  }
  return context
}
