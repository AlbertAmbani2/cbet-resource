import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../features/auth'
import Header from '../layouts/Header'
import Hero from '../features/landing/Hero'
import { TrainerSignupModal } from '../features/onboarding'

const LandingSections = lazy(() => import('../features/landing/LandingSections'))
const SignInPage = lazy(() => import('../features/auth').then(m => ({ default: m.SignInPage })))
const DashboardPage = lazy(() => import('../features/dashboard').then(m => ({ default: m.DashboardPage })))
const TrainerProfilePage = lazy(() => import('../features/trainer').then(m => ({ default: m.default })))
const LeaderboardPage = lazy(() => import('../features/leaderboard').then(m => ({ default: m.default })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <div className="app relative w-full overflow-hidden">
        <TrainerSignupModal />
        <Routes>
          <Route path="/signin" element={<Suspense fallback={<PageLoader />}><SignInPage /></Suspense>} />
          <Route
            path="/"
            element={
              <div className="relative z-10">
                <Header />
                <Hero />
                <Suspense fallback={<div className="min-h-[200px]" />}>
                  <LandingSections />
                </Suspense>
              </div>
            }
          />
          <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
          <Route path="/trainer/:id" element={<Suspense fallback={<PageLoader />}><TrainerProfilePage /></Suspense>} />
          <Route path="/leaderboard" element={<Suspense fallback={<PageLoader />}><LeaderboardPage /></Suspense>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
