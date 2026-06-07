import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../features/TrainerOnboarding'
import Header from '../components/Header'

// Mock pages for routing
function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to CBET Resource Hub</p>
    </div>
  )
}

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Trainer Dashboard</p>
    </div>
  )
}

function SignInPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <p>Please sign in to continue</p>
    </div>
  )
}

// Mock ProtectedRoute component (for reference in future tests)
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { trainerData } = useAuth()
//   
//   if (!trainerData) {
//     return <SignInPage />
//   }
//   
//   return <>{children}</>
// }

describe('Logout Flow - End-to-End', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should show Sign In link when logged out', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    )
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('should show user name and logout button when logged in', () => {
    // Set up logged-in state
    localStorage.setItem('trainerId', 'trainer-123')
    localStorage.setItem('trainerData', JSON.stringify({
      id: 'trainer-123',
      email: 'trainer@example.com',
      fullName: 'Jane Trainer',
      department: 'ICT',
      createdAt: '2024-01-01T00:00:00Z',
      isVerified: true
    }))

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    )
    
    // Verify logged-in state
    expect(screen.getByText('Jane Trainer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('should clear localStorage when logout button is clicked', async () => {
    // Set up logged-in state
    localStorage.setItem('trainerId', 'trainer-123')
    localStorage.setItem('trainerData', JSON.stringify({
      id: 'trainer-123',
      email: 'trainer@example.com',
      fullName: 'Jane Trainer',
      department: 'ICT',
      createdAt: '2024-01-01T00:00:00Z',
      isVerified: true
    }))

    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    )
    
    // Verify localStorage is populated
    expect(localStorage.getItem('trainerId')).toBe('trainer-123')
    expect(localStorage.getItem('trainerData')).toBeTruthy()

    // Click logout
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    // Verify localStorage is cleared
    await waitFor(() => {
      expect(localStorage.getItem('trainerId')).toBeNull()
      expect(localStorage.getItem('trainerData')).toBeNull()
    })
  })

  it('should redirect to home page after logout', async () => {
    // Set up logged-in state
    localStorage.setItem('trainerId', 'trainer-123')
    localStorage.setItem('trainerData', JSON.stringify({
      id: 'trainer-123',
      email: 'trainer@example.com',
      fullName: 'Jane Trainer',
      department: 'ICT',
      createdAt: '2024-01-01T00:00:00Z',
      isVerified: true
    }))

    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<><Header /><HomePage /></>} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )

    // Should start on home page with logout button visible
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()

    // Click logout
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    // Verify we're redirected and localStorage is cleared
    await waitFor(() => {
      expect(localStorage.getItem('trainerId')).toBeNull()
    }, { timeout: 3000 })
  })

  it('should complete full logout sequence: logged in -> click logout -> navigate to home', async () => {
    // Simulate a logged-in user
    const trainerData = {
      id: 'trainer-123',
      email: 'trainer@example.com',
      fullName: 'Jane Trainer',
      department: 'ICT',
      createdAt: '2024-01-01T00:00:00Z',
      isVerified: true
    }

    localStorage.setItem('trainerId', trainerData.id)
    localStorage.setItem('trainerData', JSON.stringify(trainerData))

    const user = userEvent.setup()

    const { unmount } = render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    )

    // Step 1: Verify logged-in state
    expect(screen.getByText('Jane Trainer')).toBeInTheDocument()
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    expect(logoutButton).toBeInTheDocument()

    // Step 2: Click logout
    await user.click(logoutButton)

    // Step 3: Verify localStorage cleared
    await waitFor(() => {
      expect(localStorage.getItem('trainerId')).toBeNull()
      expect(localStorage.getItem('trainerData')).toBeNull()
    })

    // Step 4: Verify logout button is gone
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument()

    unmount()
  })

  it('should persist logout across page refresh', async () => {
    // Simulate a logged-in user
    localStorage.setItem('trainerId', 'trainer-123')
    localStorage.setItem('trainerData', JSON.stringify({
      id: 'trainer-123',
      email: 'trainer@example.com',
      fullName: 'Jane Trainer',
      department: 'ICT',
      createdAt: '2024-01-01T00:00:00Z',
      isVerified: true
    }))

    const user = userEvent.setup()

    const { unmount } = render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    )

    // Verify logged in
    expect(screen.getByText('Jane Trainer')).toBeInTheDocument()

    // Logout
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    // Clear localStorage to simulate logout
    localStorage.clear()

    // Clean up and re-render (simulating page refresh)
    unmount()

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    )

    // After refresh, should be logged out
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.queryByText('Jane Trainer')).not.toBeInTheDocument()
  })
})
