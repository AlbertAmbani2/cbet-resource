import { cn } from '../../lib/utils'

type Size = 'sm' | 'md' | 'lg' | 'xl'

const sizes: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
}

interface AvatarProps {
  name?: string | null
  src?: string | null
  size?: Size
  className?: string
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-white ring-2 ring-white',
        sizes[size],
        className,
      )}
      aria-hidden={!name}
    >
      {src ? <img src={src} alt={name ?? ''} className="h-full w-full object-cover" /> : initial}
    </div>
  )
}
