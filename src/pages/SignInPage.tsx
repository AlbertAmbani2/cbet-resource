import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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
      if (err instanceof TypeError) {
        setError(`Cannot reach API at ${apiUrl}. Make sure the backend is running with yarn dev and http://localhost:3000/health responds.`)
      } else {
        setError(err instanceof Error ? err.message : 'Sign in failed')
      }
    } finally {
      setIsLoading(false)
    }
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

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
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
        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={handleSignInClick}
            className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="text-center">
            <Link
              to="/"
              className="inline-block font-medium text-sky-600 transition hover:text-sky-800"
            >
              ← Back to homepage
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          Need help? Contact support if you cannot sign in.
        </div>
      </div>
    </div>
  )
}
