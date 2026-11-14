import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Download,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
} from 'lucide-react'
import { API_ENDPOINTS, RESOURCE_TYPES } from '@shared/constants'
import type { Resource, TrainerResponse } from '@shared/types'
import { api } from '../../lib/api'
import { useAuth } from '../auth'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
  Skeleton,
  StatCard,
} from '../../components/ui'

interface ResourcesResponse {
  data: Resource[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

const typeLabel = (value?: string) =>
  RESOURCE_TYPES.find(type => type.value === value)?.label ?? 'Resource'

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

export default function OverviewPage() {
  const { trainerData, updateTrainerData } = useAuth()
  const [profile, setProfile] = useState<TrainerResponse | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const trainerId = trainerData?.id

  const load = useCallback(async () => {
    if (!trainerId) return
    setLoading(true)
    setError(null)
    try {
      const [profileData, resourcesData] = await Promise.all([
        api.get<TrainerResponse>(API_ENDPOINTS.TRAINER_ME_PROFILE),
        api.get<ResourcesResponse>(API_ENDPOINTS.TRAINER_RESOURCES(trainerId), { limit: '4' }),
      ])
      setProfile(profileData)
      updateTrainerData(profileData)
      setResources(resourcesData.data ?? [])
      setTotal(resourcesData.pagination?.total ?? resourcesData.data?.length ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load your overview')
    } finally {
      setLoading(false)
    }
  }, [trainerId, updateTrainerData])

  useEffect(() => {
    void load()
  }, [load])

  const firstName = (profile?.fullName ?? trainerData?.fullName)?.split(' ')[0] || 'Trainer'
  const completionFields = [
    Boolean(profile?.fullName),
    Boolean(profile?.department),
    Boolean(profile?.institution),
    Boolean(profile?.bio),
    Boolean(profile?.contactEmail),
  ]
  const completion = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100,
  )
  const verified = profile?.verificationStatus === 'verified' || profile?.isVerified

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${firstName}`}
        description="Track your teaching resources, keep your profile polished, and manage your trainer account."
        actions={
          <>
            <Link to="/dashboard/profile">
              <Button variant="secondary" leadingIcon={<UserRound size={15} />}>
                Edit profile
              </Button>
            </Link>
            <Link to="/dashboard/upload">
              <Button leadingIcon={<UploadCloud size={15} />}>Upload resource</Button>
            </Link>
          </>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Published resources"
          value={loading ? '—' : total}
          hint="Approved and visible to everyone"
        />
        <StatCard
          icon={Download}
          label="Total downloads"
          value={loading ? '—' : profile?.totalDownloads ?? 0}
          hint="Across all your resources"
          tone="sky"
        />
        <StatCard
          icon={Sparkles}
          label="Profile completion"
          value={`${completion}%`}
          hint={completion === 100 ? 'Your profile is complete' : 'Finish your public profile'}
          tone="violet"
        />
        <StatCard
          icon={ShieldCheck}
          label="Account status"
          value={verified ? 'Verified' : 'Active'}
          hint={verified ? 'Your trainer account is verified' : 'Verification pending'}
          tone="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent resources</CardTitle>
              <p className="mt-0.5 text-xs text-slate-500">Your latest approved uploads.</p>
            </div>
            <Link
              to="/dashboard/resources"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight size={13} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-3 p-5">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : resources.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={FolderOpen}
                  title="No resources yet"
                  description="Upload your first lesson plan, scheme of work, or assessment to get started."
                  action={
                    <Link to="/dashboard/upload">
                      <Button size="sm" leadingIcon={<UploadCloud size={14} />}>
                        Upload resource
                      </Button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {resources.map(resource => (
                  <li key={resource.id}>
                    <Link
                      to={`/resources/${resource.id}`}
                      className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-slate-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                        <BookOpen size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900">
                          {resource.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {typeLabel(resource.resourceType)} · {resource.downloadCount ?? 0} downloads
                        </span>
                      </span>
                      <Badge tone="brand">Approved</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile strength</CardTitle>
              <Badge tone={completion === 100 ? 'brand' : 'amber'}>{completion}%</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { label: 'Full name', done: Boolean(profile?.fullName) },
                  { label: 'Department', done: Boolean(profile?.department) },
                  { label: 'Institution', done: Boolean(profile?.institution) },
                  { label: 'Short bio', done: Boolean(profile?.bio) },
                  { label: 'Contact email', done: Boolean(profile?.contactEmail) },
                ].map(item => (
                  <li key={item.label} className="flex items-center justify-between">
                    <span className={item.done ? 'text-slate-600' : 'text-slate-400'}>{item.label}</span>
                    <span
                      className={
                        item.done
                          ? 'text-xs font-semibold text-brand-600'
                          : 'text-xs font-medium text-slate-400'
                      }
                    >
                      {item.done ? 'Done' : 'Missing'}
                    </span>
                  </li>
                ))}
              </ul>
              {completion < 100 && (
                <Link to="/dashboard/profile" className="mt-4 block">
                  <Button variant="subtle" size="sm" className="w-full">
                    Complete profile
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-slate-500">
                  <CalendarDays size={14} /> Joined
                </span>
                <span className="font-medium text-slate-800">{formatDate(profile?.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-slate-500">
                  <FolderOpen size={14} /> Department
                </span>
                <span className="font-medium text-slate-800">{profile?.department ?? '—'}</span>
              </div>
              <Link
                to={`/trainer/${profile?.id ?? trainerData?.id ?? ''}`}
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View public profile <ArrowRight size={13} />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
