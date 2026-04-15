import { Download, Star, CheckCircle } from 'lucide-react'
import './ResourceCard.css'
import type { Resource } from '../lib/mockData'

interface ResourceCardProps {
  resource: Resource
  onPreview?: () => void
}

export default function ResourceCard({ resource, onPreview }: ResourceCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="resource-card">
      {/* Header: Trainer info + Verification */}
      <div className="card-header">
        <div className="trainer-info">
          <div className="trainer-avatar">
            {resource.trainerName.charAt(0)}
          </div>
          <div className="trainer-details">
            <h4 className="trainer-name">{resource.trainerName}</h4>
            {resource.isVerified && (
              <div className="verified-badge">
                <CheckCircle size={12} />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>
        <div className="resource-type-badge">
          {resource.resourceType === 'lesson_plan' && '📚'}
          {resource.resourceType === 'notes' && '📝'}
          {resource.resourceType === 'scheme_of_work' && '📋'}
          {resource.resourceType === 'assessment' && '✅'}
          {resource.resourceType === 'activity_guide' && '🎯'}
        </div>
      </div>

      {/* Title */}
      <h3 className="card-title">{resource.title}</h3>

      {/* Meta Info: Department + Type */}
      <div className="card-meta">
        <span className="department-tag">{resource.department}</span>
        <span className="type-tag">{resource.resourceType.replace('_', ' ')}</span>
      </div>

      {/* CBET Units */}
      <div className="cbet-units">
        {resource.cbetUnits.map((unit, idx) => (
          <span key={idx} className="unit-badge">{unit}</span>
        ))}
      </div>

      {/* Description */}
      <p className="card-description">
        {resource.description.length > 120 
          ? resource.description.substring(0, 120) + '...' 
          : resource.description}
      </p>

      {/* Stats: Downloads + Rating */}
      <div className="card-stats">
        <div className="stat-item">
          <Download size={16} />
          <span>{resource.downloadCount}</span>
        </div>
        <div className="stat-item">
          <Star size={16} fill="currentColor" />
          <span>{resource.rating.toFixed(1)}</span>
          <span className="review-count">({resource.reviewCount})</span>
        </div>
        <div className="stat-item approval-date">
          ✓ {formatDate(resource.approvedDate)}
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button className="btn-preview" onClick={onPreview}>
          Preview
        </button>
        <button className="btn-download">
          <Download size={16} />
          Download
        </button>
      </div>
    </div>
  )
}
