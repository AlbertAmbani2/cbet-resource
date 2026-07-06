import { useAuth } from '../../auth/AuthContext'

export function useTrainerSignup() {
  return useAuth()
}