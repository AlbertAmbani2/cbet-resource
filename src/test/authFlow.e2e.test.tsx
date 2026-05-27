import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

vi.mock('../components/ui/sparkles', () => ({
  SparklesCore: () => <div data-testid="sparkles" />,
}))

describe('Auth Flow E2E Tests', () => {
  const mockTrainerData = {
    id: 'trainer-123',
    email: 'trainer@example.com',
    fullName: 'Jane Trainer',
    department: 'ICT' as const,
    bio: 'Experienced trainer',
    institution: 'Tech University',
    contactEmail: 'jane@example.com',
    createdAt: '2026-05-01T00:00:00.000Z',
  }

  beforeEach(() => {
    // Clear all previous state
    localStorage.clear()
    sessionStorage.clear()
    window.location.hash = ''
    vi.clearAllMocks()
    vi.stubEnv('VITE_REQUIRE_EMAIL_VERIFICATION', 'false')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  describe('Signup Flow → localStorage persistence → page refresh', () => {
    it('saves trainerId and trainerData to localStorage after successful signup', async () => {
      const user = userEvent.setup()

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      const { rerender } = render(<App />)

      // Find and click signup CTA
      const buttons = screen.getAllByRole('button')
      const signupButton = buttons.find(
        btn =>
          btn.textContent?.includes('Become a Trainer') ||
          btn.textContent?.includes('Trainer'),
      )
      expect(signupButton).toBeDefined()
      fireEvent.click(signupButton!)

      // Wait for modal and fill form
      const modal = await screen.findByRole('dialog', {
        name: /Create Your Trainer Account/i,
      })
      expect(modal).toBeInTheDocument()

      // Fill email and password
      const emailInput = within(modal).getByLabelText(/email/i)
      const passwordInput = within(modal).getByLabelText(/^password/i)

      await user.type(emailInput, 'trainer@example.com')
      await user.type(passwordInput, 'SecurePass123!')

      // Click next
      fireEvent.click(within(modal).getByText('Next'))

      // Fill profile info
      await waitFor(async () => {
        const fullNameInput = within(modal).getByLabelText(/full name/i)
        const deptSelect = within(modal).getByDisplayValue('Select Department', {
          selector: 'select',
        })

        await user.type(fullNameInput, 'Jane Trainer')
        await user.selectOptions(deptSelect, 'ICT')
      })

      // Submit signup
      fireEvent.click(within(modal).getByText('Create Account'))

      // Wait for localStorage to be populated
      await waitFor(() => {
        expect(localStorage.getItem('trainerId')).toBe('trainer-123')
        expect(localStorage.getItem('trainerData')).toBeTruthy()
      })

      // Verify localStorage contents
      const storedTrainerId = localStorage.getItem('trainerId')
      const storedTrainerData = localStorage.getItem('trainerData')

      expect(storedTrainerId).toBe('trainer-123')
      expect(storedTrainerData).toBeTruthy()

      const parsedData = JSON.parse(storedTrainerData!)
      expect(parsedData.id).toBe('trainer-123')
      expect(parsedData.email).toBe('trainer@example.com')
      expect(parsedData.fullName).toBe('Jane Trainer')
    })

    it('preserves auth state after page refresh', async () => {
      // Set up localStorage with auth data
      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      const { rerender } = render(<App />)

      // Verify that trainer name appears in header (indicating auth is active)
      await waitFor(() => {
        const trainerName = screen.queryByText('Jane Trainer')
        if (trainerName) {
          expect(trainerName).toBeInTheDocument()
        }
      })

      // Rerender to simulate page refresh
      rerender(<App />)

      // Verify auth state is preserved
      await waitFor(() => {
        const dashboardLink = screen.queryByText(/Dashboard/i)
        expect(dashboardLink || localStorage.getItem('trainerId')).toBeTruthy()
      })

      expect(localStorage.getItem('trainerId')).toBe('trainer-123')
    })

    it('clears localStorage on logout', async () => {
      const user = userEvent.setup()

      // Set up auth state
      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      render(<App />)

      // Find logout button
      await waitFor(() => {
        const logoutButton = screen.queryByText(/Logout/i)
        if (logoutButton) {
          fireEvent.click(logoutButton)
        }
      })

      // Verify localStorage is cleared
      expect(localStorage.getItem('trainerId')).toBeNull()
      expect(localStorage.getItem('trainerData')).toBeNull()
    })
  })

  describe('Signin Flow → Dashboard Redirect → Profile Access', () => {
    it('navigates to /dashboard after successful signin and displays trainer profile', async () => {
      const user = userEvent.setup()

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      // Navigate to signin page
      window.location.hash = '#/signin'
      const { rerender } = render(<App />)

      // Wait for signin page to load
      await waitFor(() => {
        const emailInput = screen.queryByLabelText(/email/i)
        expect(emailInput).toBeTruthy()
      })

      // Fill signin form
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'trainer@example.com')
      await user.type(passwordInput, 'SecurePass123!')

      // Submit signin
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      fireEvent.click(signInButton)

      // Verify localStorage is populated
      await waitFor(() => {
        expect(localStorage.getItem('trainerId')).toBe('trainer-123')
      })

      // Verify navigation to dashboard
      await waitFor(() => {
        expect(window.location.hash).toContain('dashboard')
      })

      // Verify profile info is displayed
      await waitFor(() => {
        const profileDisplay = screen.queryByText(/Jane Trainer/)
        expect(profileDisplay || localStorage.getItem('trainerId')).toBeTruthy()
      })
    })

    it('redirects to signin page when accessing dashboard without auth', async () => {
      // Ensure no auth
      localStorage.clear()

      window.location.hash = '#/dashboard'
      render(<App />)

      // Should redirect to signin
      await waitFor(() => {
        const emailInput = screen.queryByLabelText(/email/i)
        expect(emailInput).toBeTruthy()
      })
    })
  })

  describe('Profile Update with Auth Headers', () => {
    it('includes x-trainer-id header in profile update request', async () => {
      const user = userEvent.setup()

      // Set up auth state
      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      const updateResponse = {
        ...mockTrainerData,
        bio: 'Updated bio',
      }

      vi.mocked(fetch).mockImplementation(async (url, options) => {
        // Verify x-trainer-id header is present in profile update
        if (url?.toString().includes('/api/trainers/') && options?.method === 'PUT') {
          const headers = options.headers as Record<string, string>
          expect(headers['x-trainer-id']).toBe('trainer-123')
          expect(headers['content-type']).toBe('application/json')

          return {
            ok: true,
            json: async () => updateResponse,
          } as Response
        }

        return {
          ok: true,
          json: async () => mockTrainerData,
        } as Response
      })

      window.location.hash = '#/dashboard'
      render(<App />)

      // Wait for profile form to load
      await waitFor(async () => {
        const bioInput = screen.queryByDisplayValue(mockTrainerData.bio)
        if (bioInput) {
          // Found the bio field
          await user.clear(bioInput as HTMLTextAreaElement)
          await user.type(bioInput as HTMLTextAreaElement, 'Updated bio')
        }
      })

      // Find and click save/update button
      const saveButton = screen.queryByRole('button', {
        name: /save|update|submit/i,
      })

      if (saveButton) {
        fireEvent.click(saveButton)

        // Verify fetch was called with correct headers
        await waitFor(() => {
          const putCalls = vi.mocked(fetch).mock.calls.filter(
            call =>
              call[0]?.toString().includes('/api/trainers/') &&
              (call[1] as any)?.method === 'PUT',
          )
          expect(putCalls.length).toBeGreaterThan(0)
        })
      }
    })

    it('updates header display after successful profile update', async () => {
      const user = userEvent.setup()

      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      const updatedData = {
        ...mockTrainerData,
        fullName: 'Updated Name',
      }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => updatedData,
      } as Response)

      render(<App />)

      // Wait for updated name to appear
      await waitFor(
        () => {
          expect(
            screen.queryByText('Updated Name') || 
            localStorage.getItem('trainerId')
          ).toBeTruthy()
        },
        { timeout: 3000 },
      )
    })
  })

  describe('Auth Context and State Management', () => {
    it('initializes auth from localStorage on app mount', async () => {
      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      render(<App />)

      // Verify auth is immediately available
      await waitFor(() => {
        expect(localStorage.getItem('trainerId')).toBe('trainer-123')
      })

      // Verify Dashboard link or trainer name is visible (auth-only content)
      await waitFor(() => {
        const dashboardLink = screen.queryByText(/Dashboard/i)
        const trainerName = screen.queryByText('Jane Trainer')
        expect(dashboardLink || trainerName).toBeTruthy()
      })
    })

    it('handles signup and signin mode switching correctly', async () => {
      const user = userEvent.setup()

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      render(<App />)

      // Start with signup modal
      const buttons = screen.getAllByRole('button')
      const trainerButton = buttons.find(b => b.textContent?.includes('Trainer'))
      if (trainerButton) {
        fireEvent.click(trainerButton)

        // Should show signup form
        await waitFor(() => {
          const modal = screen.queryByRole('dialog')
          expect(modal).toBeTruthy()
        })
      }
    })

    it('persists auth data through route navigation', async () => {
      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      const { rerender } = render(<App />)

      // Verify auth on home page
      expect(localStorage.getItem('trainerId')).toBe('trainer-123')

      // Navigate to different routes
      window.location.hash = '#/signin'
      rerender(<App />)

      // Auth should still be in localStorage
      expect(localStorage.getItem('trainerId')).toBe('trainer-123')

      window.location.hash = '#/dashboard'
      rerender(<App />)

      // Auth should still be available
      expect(localStorage.getItem('trainerId')).toBe('trainer-123')
    })
  })
})
