import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  FolderOpen,
  Info,
  Star,
  UploadCloud,
} from 'lucide-react'
import { API_ENDPOINTS, RESOURCE_TYPES } from '@shared/constants'
import type { Resource } from '@shared/types'
import { api } from '../../lib/api'
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  PageHeader,
  Skeleton,
} from '../../components/ui'
import { useTrainerProfile } from './useTrainerProfile'

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

export default function MyResourcesPage() {
  const { trainerId, loading: profileLoading } = useTrainerProfile()
  const [resources, setResources] = useState<Resource[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!trainerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<ResourcesResponse>(API_ENDPOINTS.TRAINER_RESOURCES(trainerId), {
        page: String(page),
        limit: '9',
      })
      setResources(data.data ?? [])
      setPages(data.pagination?.pages ?? 1)
      setTotal(data.pagination?.total ?? data.data?.length ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load your resources')
    } finally {
      setLoading(false)
    }
  }, [trainerId, page])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My resources"
        title="Your resource library"
        description="Everything you have published. Upload new materials and keep sharing with the CBET community."
        actions={
          <Link to="/dashboard/upload">
            <Button leadingIcon={<UploadCloud size={15} />}>Upload resource</Button>
          </Link>
        }
      />

      <div className="flex items-start gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-800">
        <Info size={15} className="mt-0.5 shrink-0" />
        <p>
          This list shows approved resources. New uploads appear here once an administrator reviews and
          publishes them.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {(loading || profileLoading) && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 w-full" />
          ))}
        </div>
      )}

      {!loading && !profileLoading && resources.length === 0 && (
        <EmptyState
          icon={FolderOpen}
          title="No published resources yet"
          description="Upload a lesson plan, notes, scheme of work, or assessment to start building your library."
          action={
            <Link to="/dashboard/upload">
              <Button leadingIcon={<UploadCloud size={15} />}>Upload your first resource</Button>
            </Link>
          }
        />
      )}

      {!loading && !profileLoading && resources.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {resources.map(resource => (
              <Card key={resource.id} className="flex flex-col transition hover:border-brand-200 hover:shadow-md">
                <CardContent className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <BookOpen size={18} />
                    </span>
                    <Badge tone="brand">Approved</Badge>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-slate-900">
                    {resource.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {resource.description || 'No description provided.'}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge tone="slate">{typeLabel(resource.resourceType)}</Badge>
                    <Badge tone="violet">{resource.department}</Badge>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Download size={12} /> {resource.downloadCount ?? 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} /> {resource.rating ? Number(resource.rating).toFixed(1) : '—'}
                      </span>
                      <span className="hidden items-center gap-1 sm:inline-flex">
                        <CalendarDays size={12} /> {formatDate(resource.createdAt)}
                      </span>
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

          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm sm:flex-row">
            <p className="text-xs text-slate-500">
              Showing {resources.length} of {total} published resources
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(current => Math.max(1, current - 1))}
                leadingIcon={<ChevronLeft size={14} />}
              >
                Previous
              </Button>
              <span className="px-2 text-xs font-medium text-slate-500">
                Page {page} of {pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= pages}
                onClick={() => setPage(current => Math.min(pages, current + 1))}
                trailingIcon={<ChevronRight size={14} />}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
