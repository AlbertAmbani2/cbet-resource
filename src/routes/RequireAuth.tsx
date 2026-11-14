import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isInitialized, trainerData } = useAuth()
  const location = useLocation()

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          Preparing your workspace…
        </div>
      </div>
    )
  }

  if (!trainerData) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/signin?next=${next}`} replace />
  }

  return <>{children}</>
}
