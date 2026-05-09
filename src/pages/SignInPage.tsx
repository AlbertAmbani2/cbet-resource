import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

export function SignInPage() {
  const [visible, setVisible] = useState(window.location.hash === '#signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const handleHashChange = () => {
      setVisible(window.location.hash === '#signin')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const handleClose = () => {
    window.location.hash = ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)

    try {
      const response = await fetch(`${apiUrl}/api/trainers/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Sign in failed')
      }

      const data = await response.json()
      console.log('[SignIn] Success:', data)
      setMessage('Successfully signed in. You can now continue to the app.')
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInClick = () => {
    formRef.current?.requestSubmit()
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Sign In</h2>
            <p className="mt-1 text-sm text-slate-600">Enter your registered email and password.</p>
          </div>
          <button
            type="button"
            className="text-slate-500 transition hover:text-slate-900"
            onClick={handleClose}
            aria-label="Close sign in page"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="signin-email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
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
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="Enter your password"
              required
            />
          </div>
        </form>

        {/* Footer with Sign In Button */}
        <div className="mt-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={handleSignInClick}
            className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="font-medium text-sky-600 transition hover:text-sky-800"
              onClick={handleClose}
            >
              Back to homepage
            </button>
            <span>Need help? Contact support if you cannot sign in.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
