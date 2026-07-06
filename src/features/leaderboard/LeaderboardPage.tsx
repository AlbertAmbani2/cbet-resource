import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, BookOpen, Trophy, Medal, BadgeCheck, GraduationCap, Building2 } from 'lucide-react'
import { API_ENDPOINTS } from '@shared/constants'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface LeaderboardEntry {
  id: string
  fullName: string
  department: string
  bio?: string
  institution?: string
  verificationStatus?: string
  totalUploads: number
  totalDownloads: number
  createdAt: string
}

const rankIcons = [
  <Trophy key="gold" size={18} className="text-amber-400" />,
  <Medal key="silver" size={18} className="text-slate-400" />,
  <Medal key="bronze" size={18} className="text-amber-700" />,
]

export default function LeaderboardPage() {
  const [trainers, setTrainers] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${apiUrl}${API_ENDPOINTS.TRAINER_LEADERBOARD}?limit=20`)
        if (!res.ok) throw new Error('Failed to load leaderboard')
        const data = await res.json()
        setTrainers(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    void fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading leaderboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-slate-500">{error}</p>
        <Link to="/" className="text-sky-600 hover:text-sky-800 font-medium inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Back to homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Browse
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Trophy size={28} className="text-amber-400" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Top Trainers</h1>
            <p className="text-sm text-slate-500 mt-0.5">Leading contributors by resource downloads</p>
          </div>
        </div>

        {trainers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Trophy size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No rankings yet</p>
            <p className="text-sm text-slate-400 mt-1">Leaderboard populates as trainers get downloads.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trainers.map((t, i) => (
              <Link
                key={t.id}
                to={`/trainer/${t.id}`}
                className="block bg-white rounded-xl border border-slate-200 p-4 md:p-5 hover:shadow-md hover:border-sky-200 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center shrink-0">
                    {i < 3 ? rankIcons[i] : (
                      <span className="text-sm font-bold text-slate-400">#{i + 1}</span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.fullName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-slate-900 truncate group-hover:text-sky-600 transition-colors">
                        {t.fullName}
                      </span>
                      {t.verificationStatus === 'verified' && (
                        <BadgeCheck size={14} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap size={12} /> {t.department}
                      </span>
                      {t.institution && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 size={12} /> {t.institution}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-sm shrink-0">
                    <div className="hidden sm:block text-center">
                      <div className="font-semibold text-slate-900">{t.totalUploads}</div>
                      <div className="text-xs text-slate-400 inline-flex items-center gap-0.5">
                        <BookOpen size={11} /> resources
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-slate-900">{t.totalDownloads}</div>
                      <div className="text-xs text-slate-400 inline-flex items-center gap-0.5">
                        <Download size={11} /> downloads
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
