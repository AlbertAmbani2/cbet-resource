import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../features/auth'
import ErrorBoundary from '../components/ui/ErrorBoundary'
import PublicLayout from '../layouts/PublicLayout'
import TrainerLayout from '../layouts/TrainerLayout'
import { RequireAuth } from './RequireAuth'
import { ScrollToTop } from './ScrollToTop'

const LandingPage = lazy(() => import('../features/landing/LandingPage'))
const SignInPage = lazy(() => import('../features/auth').then(m => ({ default: m.SignInPage })))
const OverviewPage = lazy(() => import('../features/dashboard').then(m => ({ default: m.OverviewPage })))
const ProfilePage = lazy(() => import('../features/dashboard').then(m => ({ default: m.ProfilePage })))
const MyResourcesPage = lazy(() => import('../features/dashboard').then(m => ({ default: m.MyResourcesPage })))
const SubscriptionPage = lazy(() => import('../features/dashboard').then(m => ({ default: m.SubscriptionPage })))
const SettingsPage = lazy(() => import('../features/dashboard').then(m => ({ default: m.SettingsPage })))
const TrainerProfilePage = lazy(() => import('../features/trainer').then(m => ({ default: m.default })))
const LeaderboardPage = lazy(() => import('../features/leaderboard').then(m => ({ default: m.default })))
const ResourceUploadPage = lazy(() => import('../features/upload').then(m => ({ default: m.ResourceUploadPage })))
const AdminPage = lazy(() => import('../features/admin').then(m => ({ default: m.AdminPage })))
const ResourceDetailPage = lazy(() => import('../features/resourceDetail').then(m => ({ default: m.ResourceDetailPage })))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  )
}

function SafePage({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<SafePage><LandingPage /></SafePage>} />
          <Route path="/signin" element={<SafePage><SignInPage /></SafePage>} />
          <Route path="/leaderboard" element={<SafePage><LeaderboardPage /></SafePage>} />
          <Route path="/trainer/:id" element={<SafePage><TrainerProfilePage /></SafePage>} />
          <Route path="/resources/:id" element={<SafePage><ResourceDetailPage /></SafePage>} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <TrainerLayout />
            </RequireAuth>
          }
        >
          <Route index element={<SafePage><OverviewPage /></SafePage>} />
          <Route path="resources" element={<SafePage><MyResourcesPage /></SafePage>} />
          <Route path="upload" element={<SafePage><ResourceUploadPage /></SafePage>} />
          <Route path="profile" element={<SafePage><ProfilePage /></SafePage>} />
          <Route path="subscription" element={<SafePage><SubscriptionPage /></SafePage>} />
          <Route path="settings" element={<SafePage><SettingsPage /></SafePage>} />
          <Route path="admin" element={<SafePage><AdminPage /></SafePage>} />
        </Route>

        <Route path="/upload" element={<Navigate to="/dashboard/upload" replace />} />
        <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
