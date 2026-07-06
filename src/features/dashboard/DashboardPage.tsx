import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { API_ENDPOINTS, HTTP_HEADERS } from '@shared/constants'
import type { TrainerResponse } from '@shared/types'
import { ProfileUpdateForm } from './ProfileUpdateForm'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function DashboardPage() {
  const { trainerData, updateTrainerData, logout, isInitialized } = useAuth()
  const [profile, setProfile] = useState<TrainerResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const getAuthHeaders = (): HeadersInit => {
    const trainerId = localStorage.getItem('trainerId')
    return {
      'Content-Type': 'application/json',
      ...(trainerId ? { [HTTP_HEADERS.TRAINER_ID_HEADER]: trainerId } : {})
    }
  }

  const loadProfile = async () => {
    if (!trainerData) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiUrl}${API_ENDPOINTS.TRAINER_ME_PROFILE}`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        throw new Error(errorBody?.error || 'Unable to load profile')
      }

      const data = await response.json() as TrainerResponse
      setProfile(data)
      updateTrainerData(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load profile'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isInitialized) return
    if (!trainerData) {
      navigate('/signin')
      return
    }
    void loadProfile()
  }, [isInitialized, trainerData, navigate])

  const handleProfileUpdate = (updatedProfile: TrainerResponse) => {
    setProfile(updatedProfile)
    updateTrainerData(updatedProfile)
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-700">Loading your dashboard…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Trainer Dashboard</h1>
            <p className="mt-2 text-slate-600">Manage your profile, review your trainer account, and keep your information up to date.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Home
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Profile Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p><strong>Name:</strong> {trainerData?.fullName || '—'}</p>
              <p><strong>Email:</strong> {trainerData?.email || '—'}</p>
              <p><strong>Department:</strong> {trainerData?.department || '—'}</p>
              <p><strong>Verified:</strong> {trainerData?.isVerified ? 'Yes' : 'No'}</p>
              <p><strong>Joined:</strong> {trainerData?.createdAt ? new Date(trainerData.createdAt).toLocaleDateString() : '—'}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Account Status</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>{profile?.verificationStatus ? `Verification: ${profile.verificationStatus}` : 'Verification status unavailable'}</p>
              <p>{profile?.totalUploads !== undefined ? `Uploads: ${profile.totalUploads}` : 'Uploads not tracked yet'}</p>
              <p>{profile?.totalDownloads !== undefined ? `Downloads: ${profile.totalDownloads}` : 'Downloads not tracked yet'}</p>
            </div>
          </section>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900">Edit Profile</h2>
          <p className="mt-2 text-slate-600">Update your full name, department, institution, bio, or contact email.</p>
          {loading && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">Loading profile data…</div>
          )}
          {!loading && profile && (
            <ProfileUpdateForm profile={profile} onSuccess={handleProfileUpdate} />
          )}
        </div>
      </div>
    </div>
  )
}
