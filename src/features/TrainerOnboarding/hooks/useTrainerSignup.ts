/**
 * useTrainerSignup Hook
 * Provides access to global trainer signup context
 * Use in any component that needs to trigger signup
 */

import { useTrainerSignupContext } from '../TrainerSignupContext'

export function useTrainerSignup() {
  return useTrainerSignupContext()
}
