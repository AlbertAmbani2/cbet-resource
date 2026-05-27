import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { API_ENDPOINTS, HTTP_HEADERS } from '@shared/constants'
import type { TrainerProfileUpdate, TrainerResponse } from '@shared/types'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ProfileUpdateFormProps {
  profile: TrainerResponse
  onSuccess: (updated: TrainerResponse) => void
}

export function ProfileUpdateForm({ profile, onSuccess }: ProfileUpdateFormProps) {
  const [fullName, setFullName] = useState(profile.fullName || '')
  const [department, setDepartment] = useState(profile.department || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [institution, setInstitution] = useState(profile.institution || '')
  const [contactEmail, setContactEmail] = useState(profile.contactEmail || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setFullName(profile.fullName || '')
    setDepartment(profile.department || '')
    setBio(profile.bio || '')
    setInstitution(profile.institution || '')
    setContactEmail(profile.contactEmail || '')
  }, [profile])

  const buildHeaders = () => {
    const trainerId = localStorage.getItem('trainerId')
    const headers: Record<string, string> = {
      [HTTP_HEADERS.CONTENT_TYPE_JSON]: 'application/json'
    }
    if (trainerId) {
      headers[HTTP_HEADERS.TRAINER_ID_HEADER] = trainerId
    }
    return headers
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    const payload: TrainerProfileUpdate = {
      fullName,
      department,
      bio,
      institution,
      contactEmail
    }

    try {
      const response = await fetch(`${apiUrl}${API_ENDPOINTS.TRAINER_UPDATE_PROFILE(profile.id)}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to update profile')
      }

      const updated = (await response.json()) as TrainerResponse
      setSuccessMessage('Profile updated successfully.')
      onSuccess(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6 rounded-3xl border border-slate-200 bg-white p-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span>Full Name</span>
          <input
            value={fullName}
            onChange={event => setFullName(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span>Department</span>
          <select
            value={department}
            onChange={event => setDepartment(event.target.value as typeof department)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            required
          >
            <option value="">Select department…</option>
            <option value="ICT">ICT</option>
            <option value="Business">Business</option>
            <option value="Automotive">Automotive</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Construction">Construction</option>
            <option value="Tourism">Tourism</option>
            <option value="Health">Health</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-700">
        <span>Institution</span>
        <input
          value={institution}
          onChange={event => setInstitution(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        <span>Contact Email</span>
        <input
          type="email"
          value={contactEmail}
          onChange={event => setContactEmail(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        <span>Bio</span>
        <textarea
          value={bio}
          onChange={event => setBio(event.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  )
}
