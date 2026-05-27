import { Download, Star, Award } from 'lucide-react'
import './ResourceCard.css'
import type { Resource } from '@shared/types'

interface ResourceCardProps {
  resource: Resource
  onDownload?: (resource: Resource) => void
}

export default function ResourceCard({ resource, onDownload }: ResourceCardProps) {
  const handleDownload = () => {
    // Track download in backend
    void fetch(`http://localhost:3000/api/resources/${resource.id}/stats`, {
      method: 'GET'
    }).catch(err => console.error('Failed to track download:', err))

    // Trigger callback if provided
    onDownload?.(resource)

    // In real app: trigger actual PDF download
    window.open(resource.fileUrl, '_blank')
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatNumber = (num?: number): string => {
    if (!num) return '0'
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="resource-card">
      {/* Header: Type badge */}
      <div className="card-header">
        <div className="meta-badges">
          <span className="badge badge-department">{resource.department}</span>
          <span className="badge badge-type">{resource.resourceType.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="card-title">{resource.title}</h3>

      {/* CBET Units */}
      {resource.cbetUnits && (
        <div className="cbet-units">
          <Award size={14} />
          <span>{resource.cbetUnits}</span>
        </div>
      )}

      {/* Description */}
      <p className="card-description">
        {resource.description && resource.description.length > 100
          ? resource.description.substring(0, 100) + '...'
          : resource.description || 'No description provided'}
      </p>

      {/* Stats: Downloads + Rating + Date */}
      <div className="card-stats">
        <div className="stat-item">
          <Download size={14} />
          <span>{formatNumber(resource.downloadCount)}</span>
        </div>
        {resource.rating && (
          <div className="stat-item">
            <Star size={14} fill="currentColor" />
            <span>{resource.rating.toFixed(1)}</span>
          </div>
        )}
        {resource.approvalDate && (
          <div className="stat-item approval-date">
            ✓ {formatDate(resource.approvalDate)}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button
          type="button"
          className="btn-download"
          onClick={handleDownload}
        >
          <Download size={16} />
          Download
        </button>
      </div>
    </div>
  )
}
