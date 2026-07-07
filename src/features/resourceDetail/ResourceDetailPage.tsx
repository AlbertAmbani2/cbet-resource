import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Loader, AlertTriangle, Award, User, Star, CheckCircle, ExternalLink } from 'lucide-react'
import { api } from '../../lib/api'
import { API_ENDPOINTS } from '@shared/constants'
import type { Resource, TrainerResponse, RatingAggregate } from '@shared/types'
import ReviewSummary from '../resources/ReviewSummary'
import { ReviewForm } from '../resources/ReviewForm'
import { ReviewsList } from '../resources/ReviewsList'

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const trainerId = localStorage.getItem('trainerId')

  const [resource, setResource] = useState<Resource | null>(null)
  const [trainer, setTrainer] = useState<TrainerResponse | null>(null)
  const [aggregate, setAggregate] = useState<RatingAggregate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const fetchData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const resourceData = await api.get<{ data: Resource }>(API_ENDPOINTS.RESOURCE_BY_ID(id))
      setResource(resourceData.data)

      const [trainerData, ratingData] = await Promise.all([
        api.get<TrainerResponse>(API_ENDPOINTS.TRAINER_PROFILE(resourceData.data.trainerId)).catch(() => null),
        api.get<RatingAggregate>(API_ENDPOINTS.RESOURCE_RATING(id)).catch(() => null),
      ])
      if (trainerData) setTrainer(trainerData)
      if (ratingData) setAggregate(ratingData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load resource'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetchData()
  }, [fetchData, refreshKey])

  const handleDownload = async () => {
    if (!resource) return
    setDownloadStatus('loading')

    try {
      await api.post('/api/analytics/download', { resourceId: resource.id })
      setDownloadStatus('success')
      setTimeout(() => setDownloadStatus('idle'), 2000)
    } catch {
      setDownloadStatus('error')
      setTimeout(() => setDownloadStatus('idle'), 3000)
    }

    window.open(resource.fileUrl, '_blank')
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader size={20} className="animate-spin" />
          <span>Loading resource...</span>
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle size={40} className="text-slate-300" />
        <h1 className="text-2xl font-bold text-slate-900">{error || 'Resource not found'}</h1>
        <p className="text-slate-500">The resource you're looking for could not be found.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium">
          <ArrowLeft size={16} /> Back to homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Browse
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-medium text-sky-700 bg-sky-50 rounded-full px-3 py-1">
              {resource.department}
            </span>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 rounded-full px-3 py-1 capitalize">
              {resource.resourceType.replace(/_/g, ' ')}
            </span>
            {resource.status === 'approved' && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
                Approved
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{resource.title}</h1>

          <p className="text-slate-600 leading-relaxed mb-6">
            {resource.description || 'No description provided.'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-100 mb-6">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{resource.downloadCount}</p>
              <p className="text-xs text-slate-500">Downloads</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900 inline-flex items-center justify-center gap-1">
                {resource.rating > 0 ? resource.rating.toFixed(1) : '—'}
                <Star size={14} className="text-amber-400" fill="currentColor" />
              </p>
              <p className="text-xs text-slate-500">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900">{aggregate?.count || 0}</p>
              <p className="text-xs text-slate-500">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900 text-sm">{formatDate(resource.approvalDate || resource.createdAt)}</p>
              <p className="text-xs text-slate-500">Published</p>
            </div>
          </div>

          {resource.cbetUnits && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <Award size={16} className="text-sky-600" />
              <span className="font-medium">CBET Units:</span>
              <span>{resource.cbetUnits}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloadStatus === 'loading'}
              className="flex-1 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {downloadStatus === 'loading' ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {downloadStatus === 'loading' ? 'Tracking...' : 'Download Resource'}
            </button>
            {trainer && (
              <Link
                to={`/trainer/${resource.trainerId}`}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition inline-flex items-center justify-center gap-2"
              >
                <User size={16} />
                View Trainer Profile
                <ExternalLink size={14} />
              </Link>
            )}
          </div>

          {downloadStatus === 'success' && (
            <p className="mt-3 text-sm text-emerald-600 inline-flex items-center gap-1">
              <CheckCircle size={14} /> Download tracked
            </p>
          )}
          {downloadStatus === 'error' && (
            <p className="mt-3 text-sm text-red-600 inline-flex items-center gap-1">
              <AlertTriangle size={14} /> Download tracking failed
            </p>
          )}
        </div>

        {trainer && (
          <Link
            to={`/trainer/${resource.trainerId}`}
            className="block bg-white rounded-2xl border border-slate-200 p-5 mb-6 hover:shadow-md hover:border-sky-200 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {trainer.fullName?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {trainer.fullName}
                </p>
                <p className="text-sm text-slate-500">{trainer.department}</p>
              </div>
            </div>
          </Link>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Reviews</h2>

          <ReviewSummary
            aggregate={aggregate}
            reviews={[]}
            onWriteReview={() => setShowReviewForm(true)}
            trainerId={trainerId}
          />

          {showReviewForm && (
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <ReviewForm
                resourceId={resource.id}
                onSuccess={() => {
                  setShowReviewForm(false)
                  setRefreshKey(k => k + 1)
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <div className="mt-6">
            <ReviewsList
              resourceId={resource.id}
              trainerId={trainerId}
              onReviewChanged={() => setRefreshKey(k => k + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
