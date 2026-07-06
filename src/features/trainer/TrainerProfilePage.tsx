import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, BookOpen, Award, Star, BadgeCheck, Building2, GraduationCap } from 'lucide-react'
import type { TrainerResponse, Resource } from '@shared/types'
import { API_ENDPOINTS } from '@shared/constants'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function TrainerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [trainer, setTrainer] = useState<TrainerResponse | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!id) return
    setLoading(true)

    try {
      const [profileRes, resourcesRes] = await Promise.all([
        fetch(`${apiUrl}${API_ENDPOINTS.TRAINER_PROFILE(id)}`),
        fetch(`${apiUrl}${API_ENDPOINTS.TRAINER_RESOURCES(id)}?limit=20`)
      ])

      if (!profileRes.ok) {
        if (profileRes.status === 404) {
          setError('Trainer not found')
        } else {
          throw new Error('Failed to load trainer profile')
        }
        return
      }

      const profileData = await profileRes.json() as TrainerResponse
      setTrainer(profileData)

      if (resourcesRes.ok) {
        const resourcesData = await resourcesRes.json()
        setResources(resourcesData.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load profile')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-4xl">🔍</div>
        <h1 className="text-2xl font-bold text-slate-900">{error}</h1>
        <p className="text-slate-500">The trainer you're looking for could not be found.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium">
          <ArrowLeft size={16} /> Back to homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Browse
        </Link>

        {trainer && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shrink-0">
                {trainer.fullName?.charAt(0).toUpperCase() || '?'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 truncate">
                    {trainer.fullName}
                  </h1>
                  {trainer.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 w-fit">
                      <BadgeCheck size={14} /> Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-slate-400" />
                    {trainer.department}
                  </span>
                  {trainer.institution && (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 size={14} className="text-slate-400" />
                      {trainer.institution}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={14} className="text-slate-400" />
                    {trainer.totalUploads || 0} resources
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Download size={14} className="text-slate-400" />
                    {trainer.totalDownloads || 0} downloads
                  </span>
                </div>
              </div>
            </div>

            {trainer.bio && (
              <p className="mt-5 text-slate-700 leading-relaxed border-t border-slate-100 pt-5">
                {trainer.bio}
              </p>
            )}
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-900 mb-4 inline-flex items-center gap-2">
          <Award size={20} className="text-sky-600" />
          Resources by this Trainer
        </h2>

        {resources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No resources uploaded yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map(r => (
              <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-sky-700 bg-sky-50 rounded-full px-2.5 py-0.5">
                    {r.department}
                  </span>
                  {r.rating > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                      <Star size={12} fill="currentColor" />
                      {r.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {r.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Download size={12} /> {r.downloadCount || 0}
                  </span>
                  <span className="capitalize">{r.resourceType?.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
