import type { FormEvent } from 'react'
import { useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function SignInPage() {
  const { formData, updateFormData, submitForm, error, success, isLoading, switchMode, trainerData, mode } = useAuth()
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    switchMode('signin')
  }, [switchMode])

  useEffect(() => {
    if (success && trainerData && mode === 'signin') {
      navigate('/dashboard')
    }
  }, [success, trainerData, mode, navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitForm()
  }

  const handleSignInClick = () => {
    formRef.current?.requestSubmit()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
          <p className="text-slate-600">Enter your registered email and password.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="signin-email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="signin-email"
              type="email"
              value={formData.email}
              onChange={event => updateFormData('email', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signin-password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              value={formData.password}
              onChange={event => updateFormData('password', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={handleSignInClick}
              className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="text-center">
              <Link
                to="/"
                className="inline-block font-medium text-sky-600 transition hover:text-sky-800"
              >
                <ArrowLeft size={16} />
                Back to homepage
              </Link>
            </div>
          </div>
        </form>

        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            Successfully signed in. You can now continue to the app.
          </div>
        )}

        {trainerData && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Signed in as {trainerData.fullName} ({trainerData.email})
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-500">
          Need help? Contact support if you cannot sign in.
        </div>
      </div>
    </div>
  )
}
