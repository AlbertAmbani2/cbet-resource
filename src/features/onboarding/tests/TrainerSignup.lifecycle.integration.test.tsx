import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TrainerCTA from '../CTAs/TrainerCTA'
import { TrainerSignupModal } from '../TrainerSignupModal'
import { AuthProvider } from '../../auth/AuthContext'
import { useTrainerSignup } from '../hooks/useTrainerSignup'

function SignupHarness() {
  const { openSignup } = useTrainerSignup()

  return (
    <>
      <TrainerCTA
        variant="secondary"
        label="Open Signup"
        onSignupClick={() => openSignup('integration-harness')}
      />
      <TrainerSignupModal />
    </>
  )
}

function SignupWithRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SignupHarness />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Trainer signup lifecycle integration', () => {
  it('opens modal from CTA through shared hook context', () => {
    render(<SignupWithRouter />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Signup' }))
    expect(screen.getByRole('dialog', { name: /Create Your Trainer Account/i })).toBeInTheDocument()
  })

  it('closes modal from close button and backdrop', async () => {
    const { container } = render(<SignupWithRouter />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Signup' }))
    fireEvent.click(screen.getByLabelText('Close'))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Open Signup' }))
    const backdrop = container.querySelector('.trainer-modal-backdrop')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop!)
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('retains entered form data while progressing and navigating back', async () => {
    render(<SignupWithRouter />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Signup' }))

    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(emailInput, { target: { value: 'trainer@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } })
    fireEvent.click(screen.getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Your Profile')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jane Trainer' } })
    fireEvent.click(screen.getByText('Back'))

    await waitFor(() => {
      expect(screen.getByText('Email & Password')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Email Address')).toHaveValue('trainer@example.com')
    expect(screen.getByLabelText('Password')).toHaveValue('SecurePass123!')
  })
})

