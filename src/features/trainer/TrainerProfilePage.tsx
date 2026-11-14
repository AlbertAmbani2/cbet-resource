import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Download,
  GraduationCap,
  Mail,
  Star,
} from 'lucide-react'
import type { TrainerResponse, Resource } from '@shared/types'
import { API_ENDPOINTS, RESOURCE_TYPES } from '@shared/constants'
import { Avatar, Badge, Card, CardContent, EmptyState, Skeleton } from '../../components/ui'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const typeLabel = (value?: string) =>
  RESOURCE_TYPES.find(type => type.value === value)?.label ?? 'Resource'

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

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
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <BookOpen size={26} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">{error ?? 'Trainer not found'}</h1>
        <p className="mt-1 text-sm text-slate-500">
          The trainer you're looking for could not be found.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          <ArrowLeft size={15} /> Back to browse
        </Link>
      </div>
    )
  }

  const verified = trainer.verificationStatus === 'verified' || trainer.isVerified
  const totalResources = trainer.totalUploads ?? resources.length
  const totalDownloads =
    trainer.totalDownloads ?? resources.reduce((sum, resource) => sum + (resource.downloadCount || 0), 0)
  const rated = resources.filter(resource => Number(resource.rating) > 0)
  const averageRating = rated.length
    ? rated.reduce((sum, resource) => sum + Number(resource.rating), 0) / rated.length
    : null

  return (
    <div className="bg-slate-50 pb-16">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-brand-600"
        >
          <ArrowLeft size={14} /> Back to browse
        </Link>

        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700" />
          <div className="px-6 pb-6 md:px-8 md:pb-8">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <Avatar name={trainer.fullName} size="xl" className="ring-4 ring-white" />
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{trainer.fullName}</h1>
                    {verified && (
                      <Badge tone="brand">
                        <BadgeCheck size={12} /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap size={14} /> {trainer.department}
                    </span>
                    {trainer.institution && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 size={14} /> {trainer.institution}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {(trainer.contactEmail || trainer.email) && (
                <a
                  href={`mailto:${trainer.contactEmail || trainer.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Mail size={15} /> Contact trainer
                </a>
              )}
            </div>

            {trainer.bio && (
              <p className="mt-5 max-w-3xl border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-600">
                {trainer.bio}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Resources</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{totalResources}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Downloads</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{totalDownloads}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Average rating</p>
                <p className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-slate-900">
                  {averageRating ? averageRating.toFixed(1) : '—'}
                  <Star size={16} className="text-amber-500" fill={averageRating ? 'currentColor' : 'none'} />
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                <Award size={18} className="text-brand-600" /> Published resources
              </h2>
              <span className="text-xs text-slate-500">{resources.length} shown</span>
            </div>

            {resources.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No published resources yet"
                description="This trainer has not shared any approved resources so far."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {resources.map(resource => (
                  <Card
                    key={resource.id}
                    className="flex flex-col transition hover:border-brand-200 hover:shadow-md"
                  >
                    <CardContent className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <BookOpen size={16} />
                        </span>
                        <Badge tone="slate">{typeLabel(resource.resourceType)}</Badge>
                      </div>
                      <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-slate-900">
                        {resource.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {resource.description || 'No description provided.'}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <Download size={12} /> {resource.downloadCount || 0}
                          </span>
                          {Number(resource.rating) > 0 && (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <Star size={12} fill="currentColor" /> {Number(resource.rating).toFixed(1)}
                            </span>
                          )}
                        </span>
                        <Link
                          to={`/resources/${resource.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
                        >
                          Open <ArrowRight size={12} />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-slate-900">About this trainer</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">Department</dt>
                    <dd className="mt-0.5 font-medium text-slate-800">{trainer.department}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">Institution</dt>
                    <dd className="mt-0.5 font-medium text-slate-800">
                      {trainer.institution || 'Not provided'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">Member since</dt>
                    <dd className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-slate-800">
                      <CalendarDays size={13} /> {formatDate(trainer.createdAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-400">Contact</dt>
                    <dd className="mt-0.5 truncate font-medium text-slate-800">
                      {trainer.contactEmail || trainer.email}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="bg-brand-50/60">
              <CardContent>
                <p className="text-sm font-semibold text-slate-900">Share knowledge</p>
                <p className="mt-1 text-xs text-slate-600">
                  Are you a CBET trainer? Publish your own resources and reach educators across the country.
                </p>
                <Link
                  to="/dashboard/upload"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  Upload a resource <ArrowRight size={13} />
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
