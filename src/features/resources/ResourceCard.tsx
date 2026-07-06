import { Download, Star, Award, AlertCircle, CheckCircle, MessageSquare, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ResourceCard.css'
import type { Resource } from '@shared/types'
import { ResourceReviewModal } from './ResourceReviewModal'

interface ResourceCardProps {
  resource: Resource
  onDownload?: (resource: Resource) => void
  showReviewModal?: boolean
}

export default function ResourceCard({ resource, onDownload }: ResourceCardProps) {
  const [trackingStatus, setTrackingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [trackingMessage, setTrackingMessage] = useState<string>('')
  const [showReviews, setShowReviews] = useState(false)

  const handleDownload = async () => {
    setTrackingStatus('loading')
    
    try {
      // Track download in backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/analytics/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resourceId: resource.id })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to track download')
      }

      const data = await response.json()
      
      if (data.success) {
        setTrackingStatus('success')
        setTrackingMessage(data.cached ? 'Download tracked (cached)' : 'Download tracked')
        
        // Clear success message after 2 seconds
        setTimeout(() => {
          setTrackingStatus('idle')
          setTrackingMessage('')
        }, 2000)
      } else {
        throw new Error('Download tracking failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track download'
      console.error('Download tracking error:', errorMessage)
      setTrackingStatus('error')
      setTrackingMessage(errorMessage)
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setTrackingStatus('idle')
        setTrackingMessage('')
      }, 3000)
    }

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
      {/* Tracking Status Message */}
      {trackingStatus !== 'idle' && (
        <div className={`tracking-status tracking-status-${trackingStatus}`}>
          <div className="tracking-icon">
            {trackingStatus === 'loading' && <div className="spinner" />}
            {trackingStatus === 'success' && <CheckCircle size={16} />}
            {trackingStatus === 'error' && <AlertCircle size={16} />}
          </div>
          <span className="tracking-message">{trackingMessage}</span>
        </div>
      )}

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

      {/* Stats: Downloads + Rating + Reviews + Date */}
      <div className="card-stats">
        <div className="stat-item">
          <Download size={14} />
          <span>{formatNumber(resource.downloadCount)}</span>
        </div>
        <div className="stat-item">
          <Star size={14} fill={resource.rating > 0 ? 'currentColor' : 'none'} />
          <span>{resource.rating > 0 ? resource.rating.toFixed(1) : '—'}</span>
        </div>
        <button type="button" className="stat-item stat-link" onClick={() => setShowReviews(true)}>
          <MessageSquare size={14} />
          <span>Reviews</span>
        </button>
        {resource.approvalDate && (
          <div className="stat-item approval-date">
            <CheckCircle size={14} />
            {formatDate(resource.approvalDate)}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card-actions">
        <Link
          to={`/trainer/${resource.trainerId}`}
          className="btn-preview"
        >
          <User size={14} />
          Trainer
        </Link>
        <button
          type="button"
          className={`btn-download ${trackingStatus === 'loading' ? 'loading' : ''}`}
          onClick={handleDownload}
          disabled={trackingStatus === 'loading'}
        >
          {trackingStatus === 'loading' ? (
            <>
              <div className="spinner-inline" />
              Tracking...
            </>
          ) : (
            <>
              <Download size={16} />
              Download
            </>
          )}
        </button>
      </div>

      {showReviews && (
        <ResourceReviewModal
          resourceId={resource.id}
          resourceTitle={resource.title}
          onClose={() => setShowReviews(false)}
        />
      )}
    </div>
  )
}
