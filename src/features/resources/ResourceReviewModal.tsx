import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { API_ENDPOINTS } from '@shared/constants'
import type { RatingAggregate } from '@shared/types'
import ReviewSummary from './ReviewSummary'
import { ReviewsList } from './ReviewsList'
import { ReviewForm } from './ReviewForm'
import './ReviewComponents.css'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ResourceReviewModalProps {
  resourceId: string
  resourceTitle: string
  onClose: () => void
}

export function ResourceReviewModal({ resourceId, resourceTitle, onClose }: ResourceReviewModalProps) {
  const [aggregate, setAggregate] = useState<RatingAggregate | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const trainerId = localStorage.getItem('trainerId')

  const fetchRating = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}${API_ENDPOINTS.RESOURCE_RATING(resourceId)}`)
      if (response.ok) {
        const data = await response.json()
        setAggregate(data)
      }
    } catch {
      // Silently fail — rating is non-critical
    }
  }, [resourceId])

  useEffect(() => {
    void fetchRating()
  }, [fetchRating, refreshKey])

  const handleReviewChanged = () => {
    setShowForm(false)
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="review-modal-backdrop" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()} role="dialog" aria-labelledby="review-modal-title">
        <div className="review-modal-header">
          <div>
            <h3 id="review-modal-title">Reviews</h3>
            <p className="review-modal-subtitle">{resourceTitle}</p>
          </div>
          <button type="button" className="review-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="review-modal-body">
          <ReviewSummary
            aggregate={aggregate}
            reviews={[]}
            onWriteReview={() => setShowForm(true)}
            trainerId={trainerId}
          />

          {showForm && (
            <div className="review-form-section">
              <ReviewForm
                resourceId={resourceId}
                onSuccess={handleReviewChanged}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          <ReviewsList
            resourceId={resourceId}
            trainerId={trainerId}
            onReviewChanged={handleReviewChanged}
          />
        </div>
      </div>
    </div>
  )
}
