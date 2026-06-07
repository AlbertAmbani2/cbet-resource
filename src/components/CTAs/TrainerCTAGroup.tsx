/**
 * TrainerCTAGroup Component
 * Combines multiple CTAs (e.g., primary "Create Account" + secondary "Browse")
 * Handles layout and spacing for common patterns
 */

import TrainerCTA from './TrainerCTA'
import './TrainerCTA.css'

interface TrainerCTAGroupProps {
  primaryLabel?: string
  primaryDescription?: string
  onPrimaryClick: () => void
  showSecondary?: boolean
  secondaryLabel?: string
  onSecondaryClick?: () => void
  layout?: 'vertical' | 'horizontal'
  className?: string
}

export default function TrainerCTAGroup({
  primaryLabel = 'Create Trainer Account',
  primaryDescription,
  onPrimaryClick,
  showSecondary = false,
  secondaryLabel = 'Browse Resources',
  onSecondaryClick,
  layout = 'vertical',
  className = ''
}: TrainerCTAGroupProps) {
  return (
    <div className={`trainer-cta-group trainer-cta-group--${layout} ${className}`}>
      <TrainerCTA
        variant="primary"
        label={primaryLabel}
        description={primaryDescription}
        onSignupClick={onPrimaryClick}
      />
      
      {showSecondary && (
        <TrainerCTA
          variant="secondary"
          label={secondaryLabel}
          onSignupClick={onSecondaryClick || (() => {})}
          href="#resources"
        />
      )}
    </div>
  )
}
