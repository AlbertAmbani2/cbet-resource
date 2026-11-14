import { useCallback, useEffect, useState } from 'react'
import { API_ENDPOINTS } from '@shared/constants'
import type { TrainerResponse } from '@shared/types'
import { api } from '../../lib/api'
import { useAuth } from '../auth'

export function useTrainerProfile() {
  const { trainerData, updateTrainerData } = useAuth()
  const [profile, setProfile] = useState<TrainerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const trainerId = trainerData?.id

  const reload = useCallback(async () => {
    if (!trainerId) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<TrainerResponse>(API_ENDPOINTS.TRAINER_ME_PROFILE)
      setProfile(data)
      updateTrainerData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load your profile')
    } finally {
      setLoading(false)
    }
  }, [trainerId, updateTrainerData])

  useEffect(() => {
    void reload()
  }, [reload])

  const save = useCallback(
    (updated: TrainerResponse) => {
      setProfile(updated)
      updateTrainerData(updated)
    },
    [updateTrainerData],
  )

  return { profile, loading, error, reload, save, trainerId, trainerData }
}
