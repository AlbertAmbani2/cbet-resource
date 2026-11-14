import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Loader, AlertTriangle, CheckCircle, XCircle, Clock, FileText, User, Calendar } from 'lucide-react'
import { useAuth } from '../auth'
import { api } from '../../lib/api'
import { API_ENDPOINTS } from '@shared/constants'
import { PageHeader, StatCard } from '../../components/ui'
import type { Resource } from '@shared/types'

interface PendingResource extends Resource {
  trainerName?: string
  trainerDepartment?: string
}

interface AdminStats {
  pending: number
  approved: number
  rejected: number
}

export default function AdminPage() {
  const { trainerData } = useAuth()

  const [resources, setResources] = useState<PendingResource[]>([])
  const [stats, setStats] = useState<AdminStats>({ pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ resourceId: string; title: string } | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const isAdmin = trainerData?.isAdmin

  const fetchPending = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<{ data: PendingResource[]; stats: AdminStats }>(API_ENDPOINTS.ADMIN_PENDING_RESOURCES)
      setResources(data.data)
      if (data.stats) setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pending resources')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    void fetchPending()
  }, [isAdmin, fetchPending])

  const handleApprove = async (resourceId: string) => {
    setActionLoading(resourceId)
    try {
      await api.put(API_ENDPOINTS.ADMIN_APPROVE_RESOURCE(resourceId))
      setResources(prev => prev.filter(r => r.id !== resourceId))
      setStats(prev => ({ ...prev, pending: prev.pending - 1, approved: prev.approved + 1 }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve resource')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectModal) return
    setActionLoading(rejectModal.resourceId)
    try {
      await api.put(API_ENDPOINTS.ADMIN_REJECT_RESOURCE(rejectModal.resourceId), { reason: rejectReason || undefined })
      setResources(prev => prev.filter(r => r.id !== rejectModal.resourceId))
      setStats(prev => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }))
      setRejectModal(null)
      setRejectReason('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject resource')
    } finally {
      setActionLoading(null)
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <AlertTriangle size={26} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Access denied</h1>
          <p className="mt-1 text-sm text-slate-500">You do not have permission to view the admin panel.</p>
        </div>
        <Link
          to="/dashboard"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to overview
        </Link>
      </div>
    )
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Admin panel"
        description="Review and manage pending resource submissions from trainers."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Clock} label="Pending review" value={stats.pending} tone="amber" />
        <StatCard icon={CheckCircle} label="Approved" value={stats.approved} tone="brand" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} tone="red" />
      </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <XCircle size={16} />
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader size={20} className="animate-spin" />
              <span>Loading pending resources...</span>
            </div>
          </div>
        )}

        {!loading && !error && resources.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <CheckCircle size={40} className="mx-auto text-emerald-300 mb-3" />
            <p className="text-slate-900 font-semibold">All caught up!</p>
            <p className="text-sm text-slate-500 mt-1">No pending resources to review.</p>
          </div>
        )}

        {!loading && resources.length > 0 && (
          <div className="space-y-4">
            {resources.map(resource => (
              <div key={resource.id} className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText size={18} className="text-brand-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{resource.title}</h3>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <User size={11} /> {resource.trainerName || 'Unknown Trainer'}
                          </span>
                          <span>{resource.trainerDepartment || resource.department}</span>
                          <span className="capitalize">{resource.resourceType?.replace(/_/g, ' ')}</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={11} /> {formatDate(resource.uploadedAt || resource.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-2 ml-12">
                      {resource.description || 'No description'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 md:flex-col md:items-stretch shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(resource.id)}
                      disabled={actionLoading === resource.id}
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
                    >
                      {actionLoading === resource.id ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectModal({ resourceId: resource.id, title: resource.title })}
                      disabled={actionLoading === resource.id}
                      className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 transition disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {rejectModal && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => { setRejectModal(null); setRejectReason('') }} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Reject Resource</h3>
                <p className="text-sm text-slate-500 mb-4 truncate">"{rejectModal.title}"</p>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Rejection Reason <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Explain why this resource was rejected..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => { setRejectModal(null); setRejectReason('') }}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={actionLoading === rejectModal.resourceId}
                    className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
                  >
                    {actionLoading === rejectModal.resourceId ? (
                      <Loader size={14} className="animate-spin" />
                    ) : (
                      <XCircle size={14} />
                    )}
                    Confirm Reject
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  )
}
