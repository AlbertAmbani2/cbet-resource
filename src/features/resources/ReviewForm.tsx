import type { FormEvent } from 'react'
import { useState } from 'react'
import StarRating from '../../components/ui/StarRating'
import { API_ENDPOINTS, HTTP_HEADERS } from '@shared/constants'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface ReviewFormProps {
  resourceId: string
  existingReview?: { id: string; rating: number; comment?: string }
  onSuccess: () => void
  onCancel?: () => void
}

export function ReviewForm({ resourceId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trainerId = localStorage.getItem('trainerId')

  const buildHeaders = () => {
    const headers: Record<string, string> = {
      [HTTP_HEADERS.CONTENT_TYPE_JSON]: 'application/json'
    }
    if (trainerId) {
      headers[HTTP_HEADERS.TRAINER_ID_HEADER] = trainerId
    }
    return headers
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (!trainerId) {
      setError('You must be signed in to leave a review')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const url = existingReview
        ? `${apiUrl}${API_ENDPOINTS.RESOURCE_REVIEW(resourceId, existingReview.id)}`
        : `${apiUrl}${API_ENDPOINTS.RESOURCE_REVIEWS(resourceId)}`

      const response = await fetch(url, {
        method: existingReview ? 'PUT' : 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined
        })
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Failed to submit review')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3 className="review-form-title">
        {existingReview ? 'Edit Your Review' : 'Rate This Resource'}
      </h3>

      {error && (
        <div className="review-form-error">
          {error}
        </div>
      )}

      <div className="review-form-rating">
        <label>Rating</label>
        <StarRating rating={rating} size={28} interactive onChange={setRating} />
      </div>

      <div className="review-form-comment">
        <label htmlFor="review-comment">
          Comment <span className="optional">(optional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="Share your thoughts about this resource..."
        />
        <span className="char-count">{comment.length}/300</span>
      </div>

      <div className="review-form-actions">
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-submit-review" disabled={isSubmitting || rating === 0}>
          {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </form>
  )
}
