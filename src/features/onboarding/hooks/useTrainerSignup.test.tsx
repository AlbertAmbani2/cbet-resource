import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { AuthProvider } from '../../auth/AuthContext'
import { useTrainerSignup } from './useTrainerSignup'

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('useTrainerSignup', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('starts with modal closed and first step active', () => {
    const { result } = renderHook(() => useTrainerSignup(), { wrapper })
    expect(result.current.isOpen).toBe(false)
    expect(result.current.currentStep).toBe(0)
  })

  it('opens and closes signup modal', () => {
    const { result } = renderHook(() => useTrainerSignup(), { wrapper })

    act(() => result.current.openSignup('test'))
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.closeAuth())
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

  it('submits signup data through the backend API and shows success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'trainer-1',
        email: 'trainer@example.com',
        fullName: 'John Trainer',
        department: 'ICT',
        createdAt: '2026-05-06T00:00:00.000Z',
        isVerified: false
      })
    } as Response)

    const { result } = renderHook(() => useTrainerSignup(), { wrapper })

    act(() => {
      result.current.openSignup()
      result.current.updateFormData('email', 'trainer@example.com')
      result.current.updateFormData('password', 'SecurePass123!')
      result.current.updateFormData('fullName', 'John Trainer')
      result.current.updateFormData('department', 'ICT')
    })

    await act(async () => {
      await result.current.submitForm()
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/trainers/signup',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'trainer@example.com',
          password: 'SecurePass123!',
          fullName: 'John Trainer',
          department: 'ICT'
        })
      })
    )
    expect(result.current.success).toBe(true)
    expect(result.current.isOpen).toBe(true)
  })
})
