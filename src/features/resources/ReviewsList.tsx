import { useState, useEffect, useCallback } from 'react'
import type { Review } from '@shared/types'
import { API_ENDPOINTS, HTTP_HEADERS } from '@shared/constants'
import StarRating from '../../components/ui/StarRating'
import { ReviewForm } from './ReviewForm'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ReviewsListProps {
  resourceId: string
  trainerId?: string | null
  onReviewChanged: () => void
}

export function ReviewsList({ resourceId, trainerId, onReviewChanged }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingReview, setEditingReview] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${apiUrl}${API_ENDPOINTS.RESOURCE_REVIEWS(resourceId)}?page=${page}&limit=10`
      )

      if (!response.ok) throw new Error('Failed to load reviews')

      const data = await response.json()
      setReviews(data.data)
      setTotalPages(data.pagination.pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }, [resourceId, page])

  useEffect(() => {
    void fetchReviews()
  }, [fetchReviews])

  const handleDelete = async (reviewId: string) => {
    if (!trainerId) return

    try {
      const response = await fetch(
        `${apiUrl}${API_ENDPOINTS.RESOURCE_REVIEW(resourceId, reviewId)}`,
        {
          method: 'DELETE',
          headers: {
            [HTTP_HEADERS.CONTENT_TYPE_JSON]: 'application/json',
            [HTTP_HEADERS.TRAINER_ID_HEADER]: trainerId
          }
        }
      )

      if (!response.ok) throw new Error('Failed to delete review')

      onReviewChanged()
      void fetchReviews()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review')
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="reviews-list">
      <h3 className="reviews-list-title">Reviews</h3>

      {error && (
        <div className="reviews-error">
          {error}
          <button type="button" onClick={() => void fetchReviews()}>Retry</button>
        </div>
      )}

      {isLoading && reviews.length === 0 && (
        <div className="reviews-loading">Loading reviews...</div>
      )}

      {!isLoading && reviews.length === 0 && !error && (
        <div className="reviews-empty">No reviews yet. Be the first to share your thoughts!</div>
      )}

      <div className="reviews-items">
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-item-header">
              <div className="review-item-author">
                <span className="review-author-name">{review.trainerName || 'Anonymous'}</span>
                {review.trainerDepartment && (
                  <span className="review-author-dept">{review.trainerDepartment}</span>
                )}
              </div>
              <span className="review-item-date">{formatDate(review.createdAt)}</span>
            </div>

            <div className="review-item-rating">
              <StarRating rating={review.rating} size={14} />
              {review.updatedAt !== review.createdAt && (
                <span className="review-edited">(edited)</span>
              )}
            </div>

            {review.comment && (
              <p className="review-item-comment">{review.comment}</p>
            )}

            {trainerId && trainerId === review.trainerId && (
              <div className="review-item-actions">
                <button
                  type="button"
                  className="review-action-btn"
                  onClick={() => setEditingReview(editingReview === review.id ? null : review.id)}
                >
                  {editingReview === review.id ? 'Cancel' : 'Edit'}
                </button>
                <button
                  type="button"
                  className="review-action-btn review-action-delete"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              </div>
            )}

            {editingReview === review.id && (
              <div className="review-edit-form">
                <ReviewForm
                  resourceId={resourceId}
                  existingReview={{ id: review.id, rating: review.rating, comment: review.comment }}
                  onSuccess={() => {
                    setEditingReview(null)
                    onReviewChanged()
                    void fetchReviews()
                  }}
                  onCancel={() => setEditingReview(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="reviews-pagination">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
