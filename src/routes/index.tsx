import { lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../features/auth'
import Header from '../layouts/Header'
import Hero from '../features/landing/Hero'
import { TrainerSignupModal } from '../features/onboarding'
import ErrorBoundary from '../components/ui/ErrorBoundary'

const LandingSections = lazy(() => import('../features/landing/LandingSections'))
const SignInPage = lazy(() => import('../features/auth').then(m => ({ default: m.SignInPage })))
const DashboardPage = lazy(() => import('../features/dashboard').then(m => ({ default: m.DashboardPage })))
const TrainerProfilePage = lazy(() => import('../features/trainer').then(m => ({ default: m.default })))
const LeaderboardPage = lazy(() => import('../features/leaderboard').then(m => ({ default: m.default })))
const ResourceUploadPage = lazy(() => import('../features/upload').then(m => ({ default: m.ResourceUploadPage })))
const AdminPage = lazy(() => import('../features/admin').then(m => ({ default: m.AdminPage })))
const ResourceDetailPage = lazy(() => import('../features/resourceDetail').then(m => ({ default: m.ResourceDetailPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function SafePage({ children, fallback = <PageLoader /> }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <div className="app relative w-full overflow-hidden">
        <TrainerSignupModal />
        <Routes>
          <Route path="/signin" element={<SafePage><SignInPage /></SafePage>} />
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <div className="relative z-10">
                  <Header />
                  <Hero />
                  <Suspense fallback={<div className="min-h-[200px]" />}>
                    <LandingSections />
                  </Suspense>
                </div>
              </ErrorBoundary>
            }
          />
          <Route path="/dashboard" element={<SafePage><DashboardPage /></SafePage>} />
          <Route path="/trainer/:id" element={<SafePage><TrainerProfilePage /></SafePage>} />
          <Route path="/leaderboard" element={<SafePage><LeaderboardPage /></SafePage>} />
          <Route path="/upload" element={<SafePage><ResourceUploadPage /></SafePage>} />
          <Route path="/admin" element={<SafePage><AdminPage /></SafePage>} />
          <Route path="/resources/:id" element={<SafePage><ResourceDetailPage /></SafePage>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
