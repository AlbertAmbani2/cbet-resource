import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

function openSignupModal() {
  fireEvent.click(screen.getByText('Become a Trainer'))
  return screen.getByRole('dialog', { name: /Create Your Trainer Account/i })
}

describe('Trainer Signup Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens and closes modal from CTA and close button', async () => {
    render(<App />)
    const modal = openSignupModal()
    expect(modal).toBeInTheDocument()

    fireEvent.click(within(modal).getByLabelText('Close'))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('closes modal when backdrop is clicked', async () => {
    const { container } = render(<App />)
    openSignupModal()

    const backdrop = container.querySelector('.trainer-modal-backdrop')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop!)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('validates required fields on step 1', () => {
    render(<App />)
    const modal = openSignupModal()

    fireEvent.click(within(modal).getByText('Next'))
    expect(window.alert).toHaveBeenCalledWith('Please enter email and password')
  })

  it('progresses through all steps and submits', async () => {
    const user = userEvent.setup()
    render(<App />)
    let modal = openSignupModal()

    await user.type(within(modal).getByLabelText('Email Address'), 'trainer@example.com')
    await user.type(within(modal).getByLabelText('Password'), 'SecurePass123!')
    fireEvent.click(within(modal).getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Your Profile')).toBeInTheDocument()
    })
    modal = screen.getByRole('dialog', { name: /Create Your Trainer Account/i })

    await user.type(within(modal).getByLabelText('Full Name'), 'John Smith')
    fireEvent.click(within(modal).getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Choose Department')).toBeInTheDocument()
    })
    modal = screen.getByRole('dialog', { name: /Create Your Trainer Account/i })

    fireEvent.change(within(modal).getByLabelText('Department'), { target: { value: 'ICT' } })
    fireEvent.click(within(modal).getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Verify Account')).toBeInTheDocument()
    })
    modal = screen.getByRole('dialog', { name: /Create Your Trainer Account/i })

    expect(within(modal).getByText('Check your email to verify your account.')).toBeInTheDocument()
    fireEvent.click(within(modal).getByText('Complete Setup'))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('resets form after close and reopen', async () => {
    const user = userEvent.setup()
    render(<App />)
    let modal = openSignupModal()

    await user.type(within(modal).getByLabelText('Email Address'), 'trainer@example.com')
    fireEvent.click(within(modal).getByLabelText('Close'))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await new Promise((resolve) => setTimeout(resolve, 350))
    modal = openSignupModal()

    expect(within(modal).getByLabelText('Email Address')).toHaveValue('')
  })
})

