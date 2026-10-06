import { cn } from '@/components/ui'

interface MediaButtonProps {
  size?: number
  className?: string
  onClick?: () => void
}

/**
 * Play button matching Figma design (node 938:2352).
 * White semi-transparent circle with a teal play icon.
 */
export function PlayButton({ size = 80, className, onClick }: MediaButtonProps) {
  const iconSize = size * 0.4

  return (
    <button
      type="button"
      aria-label="Play video"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 4.868v22.264a1 1 0 0 0 1.508.861L28.018 17.36a1 1 0 0 0 0-1.722L9.508 4.007A1 1 0 0 0 8 4.868Z"
          fill="var(--color-primary-500)"
        />
      </svg>
    </button>
  )
}

export function PauseButton({ size = 80, className, onClick }: MediaButtonProps) {
  const barWidth = size * 0.1
  const barHeight = size * 0.35
  const gap = size * 0.12

  return (
    <button
      type="button"
      aria-label="Pause video"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110',
        className,
      )}
      style={{ width: size, height: size, gap }}
    >
      <span
        style={{
          width: barWidth,
          height: barHeight,
          borderRadius: 2,
          backgroundColor: 'var(--color-primary-500)',
        }}
      />
      <span
        style={{
          width: barWidth,
          height: barHeight,
          borderRadius: 2,
          backgroundColor: 'var(--color-primary-500)',
        }}
      />
    </button>
  )
}
