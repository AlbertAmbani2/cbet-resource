import { describe, expect, it } from 'vitest'
import { TRAINER_ONBOARDING, TRAINER_SIGNUP_EVENTS, TRAINER_SIGNUP_FLOW } from '../../../config/trainerOnboarding'

describe('trainerOnboarding config', () => {
  it('contains required top-level config sections', () => {
    expect(TRAINER_ONBOARDING).toHaveProperty('primaryCTA')
    expect(TRAINER_ONBOARDING).toHaveProperty('secondaryCTA')
    expect(TRAINER_ONBOARDING).toHaveProperty('smallCTA')
    expect(TRAINER_ONBOARDING).toHaveProperty('signupModal')
    expect(TRAINER_ONBOARDING).toHaveProperty('faq')
  })

  it('has non-empty primary CTA content', () => {
    expect(TRAINER_ONBOARDING.primaryCTA.label).toBeTruthy()
    expect(TRAINER_ONBOARDING.primaryCTA.description).toBeTruthy()
    expect(TRAINER_ONBOARDING.primaryCTA.features.length).toBeGreaterThan(0)
  })

  it('has matching flow step labels for each step', () => {
    TRAINER_SIGNUP_FLOW.steps.forEach((step) => {
      expect(TRAINER_SIGNUP_FLOW.stepLabels[step]).toBeTruthy()
    })
  })

  it('declares signup analytics event keys', () => {
    expect(TRAINER_SIGNUP_EVENTS.CTA_CLICKED).toBeTruthy()
    expect(TRAINER_SIGNUP_EVENTS.SIGNUP_STARTED).toBeTruthy()
    expect(TRAINER_SIGNUP_EVENTS.SIGNUP_COMPLETED).toBeTruthy()
    expect(TRAINER_SIGNUP_EVENTS.STEP_COMPLETED).toBeTruthy()
    expect(TRAINER_SIGNUP_EVENTS.SIGNUP_ABANDONED).toBeTruthy()
  })
})

