/**
 * useTrainerSignup Hook
 * Manages trainer signup modal state and navigation
 */

import { useState, useCallback } from 'react'

interface TrainerSignupState {
  isOpen: boolean
  currentStep: number
  formData: {
    email: string
    password: string
    fullName: string
    department: string
  }
}

export function useTrainerSignup() {
  const [state, setState] = useState<TrainerSignupState>({
    isOpen: false,
    currentStep: 0,
    formData: {
      email: '',
      password: '',
      fullName: '',
      department: ''
    }
  })

  const openSignup = useCallback((source?: string) => {
    // Track signup intent
    if (source) {
      console.log(`[Analytics] Trainer signup initiated from: ${source}`)
    }
    setState(prev => ({ ...prev, isOpen: true }))
  }, [])

  const closeSignup = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4)
    }))
  }, [])

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }))
  }, [])

  const updateFormData = useCallback((field: keyof TrainerSignupState['formData'], value: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      }
    }))
  }, [])

  const submitForm = useCallback(async () => {
    console.log('[Trainer Signup] Form submitted:', state.formData)
    // Handle API submission here
    closeSignup()
  }, [state.formData, closeSignup])

  return {
    // State
    isOpen: state.isOpen,
    currentStep: state.currentStep,
    formData: state.formData,
    
    // Actions
    openSignup,
    closeSignup,
    nextStep,
    prevStep,
    updateFormData,
    submitForm
  }
}
