import React from 'react'
import { cn } from '@/components/ui'

interface SpacerGradientProps {
  position: 'top' | 'bottom'
  color: string
  heightPercent: number
  className?: string
}

export const SpacerGradient: React.FC<SpacerGradientProps> = ({
  position,
  color,
  heightPercent,
  className,
}) => {
  // Solid edge → smooth mid-transition → gentle fade to transparent.
  const direction = position === 'top' ? 'to bottom' : 'to top'
  const gradient = [
    `linear-gradient(${direction}`,
    `${color} 0%`,
    `${color} 28%`,
    `color-mix(in srgb, ${color} 70%, transparent) 48%`,
    `color-mix(in srgb, ${color} 40%, transparent) 68%`,
    `color-mix(in srgb, ${color} 15%, transparent) 85%`,
    `transparent 100%)`,
  ].join(', ')

  return (
    <div
      className={cn('pointer-events-none absolute left-0 right-0 z-10', className)}
      style={{
        [position]: 0,
        height: `${heightPercent}%`,
        background: gradient,
      }}
    />
  )
}
