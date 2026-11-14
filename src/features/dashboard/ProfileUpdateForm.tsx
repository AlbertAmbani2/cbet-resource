import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Save } from 'lucide-react'
import { API_ENDPOINTS, DEPARTMENTS, HTTP_HEADERS } from '@shared/constants'
import type { TrainerProfileUpdate, TrainerResponse, TrainerDepartment } from '@shared/types'
import { Button } from '../../components/ui'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ProfileUpdateFormProps {
  profile: TrainerResponse
  onSuccess: (updated: TrainerResponse) => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'

export function ProfileUpdateForm({ profile, onSuccess }: ProfileUpdateFormProps) {
  const [fullName, setFullName] = useState(profile.fullName || '')
  const [department, setDepartment] = useState<TrainerDepartment | ''>(profile.department || '')
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
      [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.CONTENT_TYPE_JSON
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
      fullName: fullName.trim(),
      department: department || undefined,
      bio: bio.trim() ? bio.trim() : undefined,
      institution: institution.trim() ? institution.trim() : undefined,
      contactEmail: contactEmail.trim() ? contactEmail.trim() : undefined
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
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700" role="status">
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">
            Full name <span className="text-red-500">*</span>
          </span>
          <input
            value={fullName}
            onChange={event => setFullName(event.target.value)}
            className={inputClass}
            placeholder="Your full name"
            required
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">Department</span>
          <select
            value={department}
            onChange={event => setDepartment(event.target.value as typeof department)}
            className={inputClass}
          >
            <option value="">Select department…</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">Institution</span>
        <input
          value={institution}
          onChange={event => setInstitution(event.target.value)}
          className={inputClass}
          placeholder="e.g. Nairobi Technical Training Institute"
        />
      </label>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">Contact email</span>
        <input
          type="email"
          value={contactEmail}
          onChange={event => setContactEmail(event.target.value)}
          className={inputClass}
          placeholder="How peers can reach you (optional)"
        />
        <span className="block text-xs text-slate-400">
          Shown on your public profile. Leave blank to use your account email.
        </span>
      </label>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-slate-700">Bio</span>
        <textarea
          value={bio}
          onChange={event => setBio(event.target.value)}
          rows={5}
          maxLength={1000}
          className={inputClass}
          placeholder="Share your teaching experience, specialities, and the CBET units you cover."
        />
        <span className="block text-right text-xs text-slate-400">{bio.length}/1000</span>
      </label>

      <div className="flex justify-end border-t border-slate-100 pt-4">
        <Button type="submit" disabled={isSubmitting} leadingIcon={isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
