/**
 * Authentication Context
 * Manages both trainer signup and signin flows
 * Provides global state for authentication modals
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type AuthMode = 'signup' | 'signin'

interface FormData {
  email: string
  password: string
  fullName: string
  department: string
}

interface TrainerData {
  id: string
  email: string
  fullName: string
  department: string
  createdAt: string
  isVerified: boolean
}

interface AuthContextType {
  // Initialization State
  isInitialized: boolean

  // Modal State
  isOpen: boolean
  mode: AuthMode // 'signup' or 'signin'
  currentStep: number

  // Form Data
  formData: FormData
  isLoading: boolean
  error: string | null
  success: boolean
  isExistingUser: boolean

  // User Data (after signin)
  trainerData: TrainerData | null

  // Actions
  openSignup: (source?: string) => void
  openSignin: () => void
  closeAuth: () => void
  switchMode: (newMode: AuthMode) => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (field: keyof FormData, value: string) => void
  submitForm: () => Promise<void>
  clearError: () => void
  setSignupError: (message: string) => void
  logout: () => void
  updateTrainerData: (updatedTrainer: TrainerData) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>('signup')
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isExistingUser, setIsExistingUser] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('trainerData')
    if (stored) {
      try {
        setTrainerData(JSON.parse(stored))
      } catch {
        localStorage.removeItem('trainerData')
        localStorage.removeItem('trainerId')
      }
    }
    setIsInitialized(true)
  }, [])

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
    setMode('signup')
    setCurrentStep(0)
    setError(null)
    setSuccess(false)
    setIsOpen(true)
  }, [])

  const openSignin = useCallback(() => {
    console.log('[Analytics] Trainer signin initiated')
    setMode('signin')
    setCurrentStep(0)
    setError(null)
    setSuccess(false)
    setIsOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setIsOpen(false)
    // Reset form after closing
    setTimeout(() => {
      setCurrentStep(0)
      setIsLoading(false)
      setError(null)
      setSuccess(false)
      setFormData({
        email: '',
        password: '',
        fullName: '',
        department: ''
      })
    }, 300)
  }, [])

  const switchMode = useCallback((newMode: AuthMode) => {
    setMode(newMode)
    setCurrentStep(0)
    setError(null)
    setSuccess(false)
    setFormData({
      email: formData.email, // Keep email when switching
      password: '',
      fullName: '',
      department: ''
    })
  }, [formData.email])

  const nextStep = useCallback(() => {
    const maxSteps = mode === 'signup' ? 3 : 1 // Signin only has 1 step
    setCurrentStep(prev => Math.min(prev + 1, maxSteps))
  }, [mode])

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

  const logout = useCallback(() => {
    localStorage.removeItem('trainerData')
    localStorage.removeItem('trainerId')
    setTrainerData(null)
    setMode('signin')
    setCurrentStep(0)
    setSuccess(false)
    setError(null)
  }, [])

  const updateTrainerData = useCallback((updatedTrainer: TrainerData) => {
    setTrainerData(updatedTrainer)
    localStorage.setItem('trainerData', JSON.stringify(updatedTrainer))
  }, [])

  const submitForm = useCallback(async () => {
    try {
      setError(null)
      setIsExistingUser(false)
      setIsLoading(true)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      if (mode === 'signup') {
        // SIGNUP FLOW
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

        // Persist trainer data immediately so user is signed in
        setTrainerData(data)
        setSuccess(true)
        localStorage.setItem('trainerData', JSON.stringify(data))
        localStorage.setItem('trainerId', data.id)

        // Auto-close after 2 seconds
        setTimeout(() => {
          closeAuth()
          setSuccess(false)
        }, 2000)
      } else {
        // SIGNIN FLOW
        const response = await fetch(`${apiUrl}/api/trainers/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Signin failed')
        }

        const data = await response.json()
        console.log('[Trainer Signin] Success:', data)

        // Store trainer data
        setTrainerData(data)
        setSuccess(true)

        // Store in localStorage for persistence
        localStorage.setItem('trainerData', JSON.stringify(data))
        localStorage.setItem('trainerId', data.id)

        // Auto-close after 2 seconds
        setTimeout(() => {
          closeAuth()
        }, 2000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error(`[Trainer ${mode}] Error:`, errorMessage)
      setError(errorMessage)
      setIsExistingUser(errorMessage.toLowerCase().includes('already registered'))
    } finally {
      setIsLoading(false)
    }
  }, [formData, mode, closeAuth, switchMode])

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isOpen,
        mode,
        currentStep,
        formData,
        isLoading,
        error,
        success,
        isExistingUser,
        trainerData,
        openSignup,
        openSignin,
        closeAuth,
        switchMode,
        nextStep,
        prevStep,
        updateFormData,
        submitForm,
        clearError,
        setSignupError,
        logout,
        updateTrainerData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
