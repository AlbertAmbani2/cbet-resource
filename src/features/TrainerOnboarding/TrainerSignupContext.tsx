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
  openSignup: (source?: string) => void
  closeSignup: () => void
  nextStep: () => void
  prevStep: () => void
  updateFormData: (field: keyof FormData, value: string) => void
  submitForm: () => void
}

const TrainerSignupContext = createContext<TrainerSignupContextType | undefined>(undefined)

export function TrainerSignupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
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

  const submitForm = useCallback(() => {
    console.log('[Trainer Signup] Form submitted:', formData)
    // Handle API submission here in future
    closeSignup()
  }, [formData, closeSignup])

  return (
    <TrainerSignupContext.Provider
      value={{
        isOpen,
        currentStep,
        formData,
        openSignup,
        closeSignup,
        nextStep,
        prevStep,
        updateFormData,
        submitForm
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
