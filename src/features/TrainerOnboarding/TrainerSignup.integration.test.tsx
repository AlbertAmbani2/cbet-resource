import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from '../../App'

vi.mock('../../components/ui/sparkles', () => ({
  SparklesCore: () => <div data-testid="sparkles" />,
}))

function openSignupModal() {
  fireEvent.click(screen.getByText('Become a Trainer'))
  return screen.getByRole('dialog', { name: /Create Your Trainer Account/i })
}

describe('Trainer Signup Integration', () => {
  beforeEach(() => {
    window.location.hash = ''
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    vi.restoreAllMocks()
    vi.stubEnv('VITE_REQUIRE_EMAIL_VERIFICATION', 'false')
    vi.stubGlobal('fetch', vi.fn())
  })

  it('renders sign in when the header target hash is active', () => {
    window.location.hash = '#signin'
    render(<App />)
    const signInLink = screen.getByRole('link', { name: 'Sign In' })

    expect(signInLink).toHaveAttribute('href', '#signin')
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
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

  it('shows inline validation errors without leaving the current step', () => {
    render(<App />)
    const modal = openSignupModal()

    fireEvent.click(within(modal).getByText('Next'))
    expect(within(modal).getByRole('alert')).toHaveTextContent('Email is required')
    expect(within(modal).getByText('Email & Password')).toBeInTheDocument()
  })

  it('progresses through signup, submits to the API, and shows sign-in action', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'trainer-1',
        email: 'trainer@example.com',
        fullName: 'John Smith',
        department: 'ICT',
        createdAt: '2026-05-06T00:00:00.000Z',
        isVerified: false
      })
    } as Response)

    render(<App />)
    let modal = openSignupModal()

    fireEvent.change(within(modal).getByLabelText('Email Address'), { target: { value: 'trainer@example.com' } })
    fireEvent.change(within(modal).getByLabelText('Password'), { target: { value: 'SecurePass123!' } })
    fireEvent.click(within(modal).getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Your Profile')).toBeInTheDocument()
    })
    modal = screen.getByRole('dialog', { name: /Create Your Trainer Account/i })

    fireEvent.change(within(modal).getByLabelText('Full Name'), { target: { value: 'John Smith' } })
    fireEvent.click(within(modal).getByText('Next'))

    await waitFor(() => {
      expect(screen.getByText('Choose Department')).toBeInTheDocument()
    })
    modal = screen.getByRole('dialog', { name: /Create Your Trainer Account/i })

    fireEvent.change(within(modal).getByLabelText('Department'), { target: { value: 'ICT' } })
    fireEvent.click(within(modal).getByText('Complete Setup'))

    await waitFor(() => {
      expect(screen.getByText(/Account created successfully!/)).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/trainers/signup',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'trainer@example.com',
          password: 'SecurePass123!',
          fullName: 'John Smith',
          department: 'ICT'
        })
      })
    )
    modal = screen.getByRole('dialog', { name: /Create Your Trainer Account/i })
    fireEvent.click(within(modal).getByText('Go to Sign In'))
    window.dispatchEvent(new HashChangeEvent('hashchange'))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Create Your Trainer Account/i })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('resets form after close and reopen', async () => {
    render(<App />)
    let modal = openSignupModal()

    fireEvent.change(within(modal).getByLabelText('Email Address'), { target: { value: 'trainer@example.com' } })
    fireEvent.click(within(modal).getByLabelText('Close'))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await new Promise((resolve) => setTimeout(resolve, 350))
    modal = openSignupModal()

    expect(within(modal).getByLabelText('Email Address')).toHaveValue('')
  })
})
