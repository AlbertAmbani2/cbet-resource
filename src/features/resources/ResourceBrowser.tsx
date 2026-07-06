import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Loader, ChevronDown, AlertTriangle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import './ResourceBrowser.css'
import ResourceCard from './ResourceCard'
import DepartmentGrid from '../landing/DepartmentGrid'
import { RESOURCE_TYPES } from '@shared/constants'
import type { Resource, TrainerDepartment, ResourceType } from '@shared/types'

interface ResourcesResponse {
  data: Resource[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const DEPARTMENTS: TrainerDepartment[] = [
  'ICT',
  'Business',
  'Automotive',
  'Hospitality',
  'Construction',
  'Health'
]

export default function ResourceBrowser() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State from URL params
  const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1'))
  const [department, setDepartment] = useState<TrainerDepartment | ''>(() => (searchParams.get('department') as TrainerDepartment) || '')
  const [resourceType, setResourceType] = useState<ResourceType | ''>(() => (searchParams.get('type') as ResourceType) || '')
  const [search, setSearch] = useState(() => searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [viewMode, setViewMode] = useState<'browse' | 'department'>('browse')

  // Data state
  const [resources, setResources] = useState<Resource[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Persist filters to URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (department) params.set('department', department)
    if (resourceType) params.set('type', resourceType)
    if (search) params.set('search', search)
    setSearchParams(params, { replace: true })
  }, [page, department, resourceType, search, setSearchParams])

  // Fetch resources
  const fetchResources = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = new URL(`${API_URL}/api/resources`)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('limit', '12')
      if (department) url.searchParams.set('department', department)
      if (resourceType) url.searchParams.set('resourceType', resourceType)
      if (debouncedSearch) url.searchParams.set('search', debouncedSearch)

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error('Failed to fetch resources')

      const data = (await response.json()) as ResourcesResponse
      setResources(data.data)
      setPagination(data.pagination)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load resources'
      setError(message)
      console.error('[ResourceBrowser] Fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, department, resourceType, debouncedSearch])

  useEffect(() => {
    void fetchResources()
  }, [fetchResources])

  const handleClearFilters = useCallback(() => {
    setDepartment('')
    setResourceType('')
    setSearch('')
    setPage(1)
  }, [])

  const hasActiveFilters = useMemo(
    () => department || resourceType || search,
    [department, resourceType, search]
  )

  const handleDeptSelect = (deptName: string) => {
    setDepartment(deptName as TrainerDepartment)
    setPage(1)
    setViewMode('browse')
  }

  return (
    <section id="resources" className="resource-browser">
      <div className="container">
        {/* Header */}
        <div className="browser-header">
          <span className="section-kicker">Browse & Download</span>
          <h2 className="section-title">Find Verified CBET Resources</h2>
          <p className="section-subtitle">
            Access {pagination?.total || 0}+ quality learning materials verified by educators. Download PDFs and use offline.
          </p>
        </div>

        {/* Department Quick Access */}
        {viewMode === 'browse' && !department && (
          <button
            className="view-all-depts-btn"
            onClick={() => setViewMode('department')}
          >
            Browse by Department
            <ChevronDown size={16} />
          </button>
        )}

        {viewMode === 'department' && (
          <>
            <button
              className="back-btn"
              onClick={() => setViewMode('browse')}
            >
              <ChevronLeft size={16} />
              Back to Browse
            </button>
            <DepartmentGrid onSelectDept={handleDeptSelect} />
          </>
        )}

        {/* Search & Filters */}
        <div className="browser-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search resources, trainers, units..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-row">
            {/* Department Filter */}
            <div className="filter-group">
              <label>Department</label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment((e.target.value as TrainerDepartment) || '')
                  setPage(1)
                }}
                className="filter-select"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Type Filter */}
            <div className="filter-group">
              <label>Resource Type</label>
              <select
                value={resourceType}
                onChange={(e) => {
                  setResourceType((e.target.value as ResourceType) || '')
                  setPage(1)
                }}
                className="filter-select"
              >
                <option value="">All Types</option>
                {RESOURCE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <Loader size={32} className="animate-spin" />
            <p>Loading resources...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <AlertTriangle size={20} />
            <p>{error}</p>
            <button onClick={() => void fetchResources()}>Try Again</button>
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && !error && resources && (
          <div className="results-summary">
            <p>
              {resources.length === 0
                ? 'No resources found. Try adjusting your filters.'
                : `Showing ${resources.length} of ${pagination?.total || 0} resource${(pagination?.total || 0) === 1 ? '' : 's'}`}
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && resources.length > 0 ? (
          <>
            <div className="resources-grid">
              {resources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onDownload={() => console.log('Downloaded:', resource.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {(pagination?.pages || 0) > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <span>Page {page} of {pagination?.pages || 1}</span>
                <button
                  onClick={() => setPage(p => Math.min(pagination?.pages || 1, p + 1))}
                  disabled={page === (pagination?.pages || 1)}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : !isLoading && !error && (
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen size={48} />
            </div>
            <h3>No Resources Found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button className="btn-reset" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
