import type { FormEvent } from 'react'
import { useEffect, useMemo } from 'react'
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './AuthContext'
import { Avatar, Button } from '../../components/ui'

export function SignInPage() {
  const {
    formData,
    updateFormData,
    submitForm,
    error,
    success,
    isLoading,
    switchMode,
    trainerData,
    mode,
    isInitialized,
  } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)

  const nextPath = useMemo(() => {
    const next = searchParams.get('next')
    return next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
  }, [searchParams])

  useEffect(() => {
    switchMode('signin')
  }, [switchMode])

  useEffect(() => {
    if (success && trainerData && mode === 'signin') {
      navigate(nextPath, { replace: true })
    }
  }, [success, trainerData, mode, navigate, nextPath])

  if (isInitialized && trainerData && !success) {
    return <Navigate to={nextPath} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitForm()
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700 px-8 py-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Trainer portal</p>
            <h1 className="mt-1 text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-white/80">Sign in to manage your resources and profile.</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-slate-700">Email address</span>
                <span className="relative block">
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={event => updateFormData('email', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>

              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-slate-700">Password</span>
                <span className="relative block">
                  <LockKeyhole size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={event => updateFormData('password', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </label>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
                leadingIcon={isLoading ? <Loader2 size={16} className="animate-spin" /> : undefined}
              >
                {isLoading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            {success && trainerData && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                <Avatar name={trainerData.fullName} size="sm" />
                <span>Signed in as {trainerData.fullName}. Taking you to your dashboard…</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800">
                <ArrowLeft size={15} /> Back to site
              </Link>
              <Link to="/signin" className="font-medium text-brand-600 hover:text-brand-700">
                Need help?
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          CBET Resource Platform · Trainer access
        </p>
      </div>
    </div>
  )
}
