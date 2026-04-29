import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import { TrainerSignupProvider } from '../TrainerSignupContext'
import { useTrainerSignup } from './useTrainerSignup'

function wrapper({ children }: { children: ReactNode }) {
  return <TrainerSignupProvider>{children}</TrainerSignupProvider>
}

describe('useTrainerSignup', () => {
  it('starts with modal closed and first step active', () => {
    const { result } = renderHook(() => useTrainerSignup(), { wrapper })
    expect(result.current.isOpen).toBe(false)
    expect(result.current.currentStep).toBe(0)
  })

  it('opens and closes signup modal', () => {
    const { result } = renderHook(() => useTrainerSignup(), { wrapper })

    act(() => result.current.openSignup('test'))
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.closeSignup())
    expect(result.current.isOpen).toBe(false)
  })

  it('progresses steps forward and backward with boundaries', () => {
    const { result } = renderHook(() => useTrainerSignup(), { wrapper })

    act(() => {
      result.current.openSignup()
      result.current.nextStep()
      result.current.nextStep()
      result.current.nextStep()
      result.current.nextStep()
    })
    expect(result.current.currentStep).toBe(3)

    act(() => {
      result.current.prevStep()
      result.current.prevStep()
      result.current.prevStep()
      result.current.prevStep()
    })
    expect(result.current.currentStep).toBe(0)
  })

  it('updates form data fields', () => {
    const { result } = renderHook(() => useTrainerSignup(), { wrapper })

    act(() => {
      result.current.updateFormData('email', 'trainer@example.com')
      result.current.updateFormData('fullName', 'John Trainer')
      result.current.updateFormData('department', 'ICT')
    })

    expect(result.current.formData.email).toBe('trainer@example.com')
    expect(result.current.formData.fullName).toBe('John Trainer')
    expect(result.current.formData.department).toBe('ICT')
  })

  it('submits and closes modal', () => {
    const { result } = renderHook(() => useTrainerSignup(), { wrapper })

    act(() => {
      result.current.openSignup()
      result.current.updateFormData('email', 'trainer@example.com')
      result.current.submitForm()
    })

    expect(result.current.isOpen).toBe(false)
  })
})

