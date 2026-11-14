import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Tone = 'brand' | 'slate' | 'amber' | 'red' | 'sky' | 'violet'

const tones: Record<Tone, string> = {
  brand: 'border-brand-200 bg-brand-50 text-brand-700',
  slate: 'border-slate-200 bg-slate-50 text-slate-600',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  red: 'border-red-200 bg-red-50 text-red-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ className, tone = 'slate', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
