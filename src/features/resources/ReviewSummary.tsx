import type { RatingAggregate, Review } from '@shared/types'
import StarRating from '../../components/ui/StarRating'

interface ReviewSummaryProps {
  aggregate: RatingAggregate | null
  reviews: Review[]
  onWriteReview: () => void
  trainerId?: string | null
}

export default function ReviewSummary({ aggregate, reviews, onWriteReview, trainerId }: ReviewSummaryProps) {
  if (!aggregate || aggregate.count === 0) {
    return (
      <div className="review-summary review-summary-empty">
        <div className="review-summary-stars">
          <StarRating rating={0} size={20} />
          <span className="review-summary-count">No reviews yet</span>
        </div>
        {trainerId && (
          <button type="button" className="btn-write-review" onClick={onWriteReview}>
            Be the first to review
          </button>
        )}
      </div>
    )
  }

  const hasUserReviewed = trainerId && reviews.some(r => r.trainerId === trainerId)
  const maxCount = Math.max(...Object.values(aggregate.distribution), 1)

  return (
    <div className="review-summary">
      <div className="review-summary-header">
        <div className="review-summary-average">
          <span className="review-average-number">{aggregate.average.toFixed(1)}</span>
          <StarRating rating={Math.round(aggregate.average)} size={16} />
          <span className="review-summary-count">{aggregate.count} review{aggregate.count !== 1 ? 's' : ''}</span>
        </div>
        {trainerId && !hasUserReviewed && (
          <button type="button" className="btn-write-review" onClick={onWriteReview}>
            Write a Review
          </button>
        )}
      </div>

      <div className="review-distribution">
        {[5, 4, 3, 2, 1].map(star => {
          const count = aggregate.distribution[star] || 0
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
          return (
            <div key={star} className="distribution-row">
              <span className="distribution-label">{star}★</span>
              <div className="distribution-bar-bg">
                <div
                  className="distribution-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="distribution-count">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
