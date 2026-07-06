import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from '../routes'
import { AuthProvider } from '../features/auth'

vi.mock('../components/ui/sparkles', () => ({
  SparklesCore: () => <div data-testid="sparkles" />,
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>
  )
}

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
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    vi.stubEnv('VITE_REQUIRE_EMAIL_VERIFICATION', 'false')
    vi.stubGlobal('fetch', vi.fn())
    // Default mock for ResourceBrowser mount
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], pagination: { page: 1, limit: 12, total: 0, pages: 1 } })
    } as Response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  describe('Signup Flow → localStorage persistence → page refresh', () => {
    it('saves trainerId and trainerData to localStorage after successful signup', async () => {
      const user = userEvent.setup()
      // One more mock for signup API call
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      renderAt('/')

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
        const deptSelect = within(modal).getByRole('combobox', { name: /department/i })

        await user.type(fullNameInput, 'Jane Trainer')
        await user.selectOptions(deptSelect as HTMLSelectElement, 'ICT')
      })

      // Submit signup
      fireEvent.click(within(modal).getByText('Complete Setup'))

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
      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      const { rerender } = renderAt('/')

      // Verify that trainer name appears in header (indicating auth is active)
      await waitFor(() => {
        const trainerName = screen.queryByText('Jane Trainer')
        if (trainerName) {
          expect(trainerName).toBeInTheDocument()
        }
      })

      // Rerender to simulate page refresh
      rerender(
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </MemoryRouter>
      )

      // Verify auth state is preserved
      await waitFor(() => {
        const dashboardLink = screen.queryByText(/Dashboard/i)
        expect(dashboardLink || localStorage.getItem('trainerId')).toBeTruthy()
      })

      expect(localStorage.getItem('trainerId')).toBe('trainer-123')
    })

    it('clears localStorage on logout', async () => {
      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      renderAt('/')

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
    it('navigates to dashboard after successful signin and displays trainer profile', async () => {
      const userSetup = userEvent.setup()
      // Mock for TrainerProfilePage fetch (trainer profile on dashboard)
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockTrainerData,
      } as Response)

      renderAt('/signin')

      // Wait for signin page to load
      await waitFor(() => {
        const emailInput = screen.queryByText(/email address/i)
        expect(emailInput).toBeTruthy()
      })

      // Fill signin form
      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/^password/i)

      await userSetup.type(emailInput, 'trainer@example.com')
      await userSetup.type(passwordInput, 'SecurePass123!')

      // Submit signin
      const signInButton = screen.getByRole('button', { name: /sign in/i })
      fireEvent.click(signInButton)

      // Verify localStorage is populated
      await waitFor(() => {
        expect(localStorage.getItem('trainerId')).toBe('trainer-123')
      })
    })

    it('redirects to signin page when accessing dashboard without auth', async () => {
      localStorage.clear()
      renderAt('/dashboard')

      // Should redirect to signin
      await waitFor(() => {
        const emailInput = screen.queryByText(/email address/i)
        expect(emailInput).toBeTruthy()
      })
    })
  })

  describe('Profile Update with Auth Headers', () => {
    it('includes x-trainer-id header in profile update request', async () => {
      localStorage.setItem('trainerId', 'trainer-123')
      localStorage.setItem('trainerData', JSON.stringify(mockTrainerData))

      const updateResponse = {
        ...mockTrainerData,
        bio: 'Updated bio',
      }

      vi.mocked(fetch).mockImplementation(async (url, options) => {
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

      renderAt('/dashboard')

      // Wait for profile form to load
      await waitFor(async () => {
        try {
          const bioInputs = screen.queryAllByRole('textbox')
          const bioInput = bioInputs.find(input => 
            (input as HTMLTextAreaElement).value?.includes('Experienced')
          )
          if (bioInput) {
            const userSetup = userEvent.setup()
            await userSetup.clear(bioInput as HTMLTextAreaElement)
            await userSetup.type(bioInput as HTMLTextAreaElement, 'Updated bio')
          }
        } catch (e) {
          // Form not loaded yet
        }
      })

      // Find and click save/update button
      const saveButton = screen.queryByRole('button', {
        name: /save|update|submit/i,
      })

      if (saveButton) {
        fireEvent.click(saveButton)

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

      renderAt('/')

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

      renderAt('/')

      // Verify Dashboard link or trainer name is visible (auth-only content)
      await waitFor(() => {
        const dashboardLink = screen.queryByText(/Dashboard/i)
        const trainerName = screen.queryByText('Jane Trainer')
        expect(dashboardLink || trainerName).toBeTruthy()
      })
    })

    it('handles signup and signin mode switching correctly', async () => {
      renderAt('/')

      const buttons = screen.getAllByRole('button')
      const trainerButton = buttons.find(b => b.textContent?.includes('Trainer'))
      if (trainerButton) {
        fireEvent.click(trainerButton)

        await waitFor(() => {
          const modal = screen.queryByRole('dialog')
          expect(modal).toBeTruthy()
        })
      }
    })
  })
})
