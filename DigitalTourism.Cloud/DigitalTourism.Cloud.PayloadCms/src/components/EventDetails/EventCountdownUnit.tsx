'use client'

import React from 'react'
import { cn } from '@/components/ui'

export interface EventCountdownUnitProps {
  value: number
  label: string
  inactive?: boolean
  className?: string
}

export const EventCountdownUnit: React.FC<EventCountdownUnitProps> = ({
  value,
  label,
  inactive = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 rounded-xl px-3 py-3 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] md:rounded-2xl md:px-5 md:py-4',
        inactive
          ? 'border border-white/30 bg-white/10'
          : 'border border-countdown-stroke bg-countdown',
        className,
      )}
    >
      <span className="font-heading text-2xl font-medium text-white sm:text-3xl md:text-[40px] md:leading-[48px]">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs font-semibold uppercase text-white sm:text-sm md:text-base">
        {label}
      </span>
    </div>
  )
}
