import React from 'react'
import { cn } from '@/components/ui'
import type { OverlayTextFont } from './types'

const fontClasses: Record<OverlayTextFont, string> = {
  heading: 'font-heading font-bold',
  display: 'font-display font-semibold',
  sans: 'font-sans font-bold',
}

interface SpacerOverlayTextProps {
  text: string
  positionX: number
  positionY: number
  font?: OverlayTextFont
  fontSize?: string
  className?: string
}

export const SpacerOverlayText: React.FC<SpacerOverlayTextProps> = ({
  text,
  positionX,
  positionY,
  font = 'display',
  fontSize,
  className,
}) => {
  return (
    <span
      className={cn(
        'pointer-events-none absolute z-20 text-grey-900',
        fontClasses[font],
        !fontSize && 'text-2xl md:text-3xl lg:text-4xl',
        className,
      )}
      style={{
        left: `${positionX}%`,
        top: `${positionY}%`,
        transform: 'translate(-50%, 0%)',
        fontSize: fontSize || undefined,
      }}
    >
      {text}
    </span>
  )
}
