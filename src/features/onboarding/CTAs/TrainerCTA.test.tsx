import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import TrainerCTA from './TrainerCTA'

describe('TrainerCTA', () => {
  it('renders primary variant with expected class', () => {
    const handleClick = vi.fn()
    render(<TrainerCTA variant="primary" onSignupClick={handleClick} />)

    const buttonLikeLink = screen.getByRole('button', { name: 'Create Trainer Account' })
    expect(buttonLikeLink).toHaveClass('trainer-cta--primary')
  })

  it('renders secondary variant with custom label', () => {
    const handleClick = vi.fn()
    render(
      <TrainerCTA
        variant="secondary"
        label="Become a Trainer"
        onSignupClick={handleClick}
      />,
    )

    const buttonLikeLink = screen.getByRole('button', { name: 'Become a Trainer' })
    expect(buttonLikeLink).toHaveClass('trainer-cta--secondary')
  })

  it('renders small variant with expected class', () => {
    const handleClick = vi.fn()
    render(
      <TrainerCTA
        variant="small"
        label="Create Trainer Account"
        onSignupClick={handleClick}
      />,
    )

    const buttonLikeLink = screen.getByRole('button', { name: 'Create Trainer Account' })
    expect(buttonLikeLink).toHaveClass('trainer-cta--small')
  })

  it('calls onSignupClick when clicked', () => {
    const handleClick = vi.fn()
    render(<TrainerCTA variant="primary" onSignupClick={handleClick} />)

    fireEvent.click(screen.getByRole('button', { name: 'Create Trainer Account' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

