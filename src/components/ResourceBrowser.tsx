import { useState, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import './ResourceBrowser.css'
import ResourceCard from './ResourceCard'
import DepartmentGrid from './DepartmentGrid'
import { mockResources, departments, sortResources } from '../lib/mockData'

type SortOption = 'recent' | 'popular' | 'rating'
type ViewMode = 'browse' | 'department'

export default function ResourceBrowser() {
  const [viewMode, setViewMode] = useState<ViewMode>('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [minRating, setMinRating] = useState<number | null>(null)

  // Filter resources based on current filters
  const filteredResources = useMemo(() => {
    let results = mockResources

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      results = results.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.trainerName.toLowerCase().includes(q)
      )
    }

    // Department filter
    if (selectedDept) {
      const deptName = departments.find(d => d.id === selectedDept)?.name
      if (deptName) {
        results = results.filter(r => r.department === deptName)
      }
    }

    // Resource type filter
    if (selectedType) {
      results = results.filter(r => r.resourceType === selectedType)
    }

    // Rating filter
    if (minRating) {
      results = results.filter(r => r.rating >= minRating)
    }

    // Sort
    results = sortResources(results, sortBy)

    return results
  }, [searchQuery, selectedDept, selectedType, minRating, sortBy])

  const handleDeptSelect = (deptId: string) => {
    setSelectedDept(deptId)
    setViewMode('browse')
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedDept(null)
    setSelectedType(null)
    setMinRating(null)
  }

  return (
    <section id="resources" className="resource-browser">
      <div className="container">
        {/* Header */}
        <div className="browser-header">
          <span className="section-kicker">Browse & Download</span>
          <h2 className="section-title">Find Verified CBET Resources</h2>
          <p className="section-subtitle">
            Access 30+ quality learning materials verified by educators. Download PDFs and use offline.
          </p>
        </div>

        {/* Department Quick Access */}
        {viewMode === 'browse' && !selectedDept && (
          <>
            <button
              className="view-all-depts-btn"
              onClick={() => setViewMode('department')}
            >
              Browse by Department
              <ChevronDown size={16} />
            </button>
          </>
        )}

        {viewMode === 'department' && (
          <>
            <button
              className="back-btn"
              onClick={() => setViewMode('browse')}
            >
              ← Back to Browse
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-row">
            {/* Department Filter */}
            <div className="filter-group">
              <label>Department</label>
              <select
                value={selectedDept || ''}
                onChange={(e) => setSelectedDept(e.target.value || null)}
                className="filter-select"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Type Filter */}
            <div className="filter-group">
              <label>Resource Type</label>
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="lesson_plan">Lesson Plan</option>
                <option value="notes">Notes</option>
                <option value="scheme_of_work">Scheme of Work</option>
                <option value="assessment">Assessment</option>
                <option value="activity_guide">Activity Guide</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label>Minimum Rating</label>
              <select
                value={minRating || ''}
                onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : null)}
                className="filter-select"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4">4.0+ ⭐</option>
                <option value="3.5">3.5+ ⭐</option>
              </select>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="filter-select"
              >
                <option value="recent">Recently Approved</option>
                <option value="popular">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedDept || selectedType || minRating) && (
              <button
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            {filteredResources.length === 0
              ? 'No resources found. Try adjusting your filters.'
              : `Showing ${filteredResources.length} resource${filteredResources.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {/* Results Grid */}
        {filteredResources.length > 0 ? (
          <div className="resources-grid">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onPreview={() => console.log('Preview:', resource.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Resources Found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button className="btn-reset" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
