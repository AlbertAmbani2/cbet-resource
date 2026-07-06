import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
  maxStars?: number
}

export default function StarRating({ rating, size = 16, interactive = false, onChange, maxStars = 5 }: StarRatingProps) {
  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="star-rating" style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1
        const filled = starValue <= rating
        const partial = !filled && starValue - rating < 1 && starValue - rating > 0

        return (
          <button
            key={starValue}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              background: 'none',
              border: 'none',
              padding: 0,
              color: filled ? '#f59e0b' : partial ? '#fcd34d' : '#d1d5db',
              transition: 'color 0.15s'
            }}
            aria-label={interactive ? `${starValue} star${starValue > 1 ? 's' : ''}` : undefined}
          >
            <Star size={size} fill={filled || partial ? 'currentColor' : 'none'} />
          </button>
        )
      })}
    </div>
  )
}
