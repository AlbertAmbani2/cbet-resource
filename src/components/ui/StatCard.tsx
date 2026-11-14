import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

type Tone = 'brand' | 'sky' | 'violet' | 'amber' | 'red'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
}

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  tone?: Tone
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'brand' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', tones[tone])}>
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
