/**
 * TrainerCTA Component
 * Reusable trainer signup call-to-action with multiple variants
 *
 * Variants:
 * - primary: Large button with full branding
 * - secondary: Secondary button style
 * - small: Inline/small footer button
 *
 * Decoupled from signup logic: parent controls behavior via onSignupClick callback
 */

import './TrainerCTA.css'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'small'

interface TrainerCTAProps {
  variant?: Variant
  label?: string
  description?: string
  icon?: ReactNode
  onSignupClick: () => void
  href?: string
  className?: string
  disabled?: boolean
}

export default function TrainerCTA({
  variant = 'primary',
  label = 'Create Trainer Account',
  description,
  icon,
  onSignupClick,
  href = '#signup',
  className = '',
  disabled = false
}: TrainerCTAProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      // For anchor links, trigger the callback
      e.preventDefault()
      onSignupClick()
    } else {
      // For external links, just trigger callback
      onSignupClick()
    }
  }

  const baseClassName = `trainer-cta trainer-cta--${variant} ${className}`

  const commonProps = {
    onClick: handleClick,
    disabled,
    className: baseClassName
  }

  // Variant: Primary (large, focused)
  if (variant === 'primary') {
    return (
      <div className="trainer-cta-wrapper">
        <a role="button" href={href} {...commonProps}>
          {icon && <span className="cta-icon">{icon}</span>}
          <span className="cta-label">{label}</span>
        </a>
        {description && <p className="cta-description">{description}</p>}
      </div>
    )
  }

  // Variant: Secondary (standard button)
  if (variant === 'secondary') {
    return (
      <a role="button" href={href} {...commonProps}>
        {icon && <span className="cta-icon">{icon}</span>}
        {label}
      </a>
    )
  }

  // Variant: Small (compact, footer/inline)
  if (variant === 'small') {
    return (
      <a role="button" href={href} className={`trainer-cta trainer-cta--small ${className}`} onClick={handleClick}>
        {label}
      </a>
    )
  }

  return null
}
