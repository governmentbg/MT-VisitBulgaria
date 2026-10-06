'use client'

import React from 'react'
import { cn } from '@/components/ui/theme/cn'
import type { StatItemData, StatSize } from './types'
import { useAnimatedValue } from './useCountUp'

const sizeClasses: Record<StatSize, { value: string; label: string }> = {
  lg: { value: 'text-[2.5rem] leading-[1.1]', label: 'text-base leading-normal' },
  md: { value: 'text-[1.875rem] leading-[1.1]', label: 'text-sm leading-normal' },
  sm: { value: 'text-2xl leading-[1.1]', label: 'text-sm leading-normal' },
}

const colorClasses = {
  dark: { value: 'text-white', label: 'text-white/80' },
  light: { value: 'text-grey-900', label: 'text-grey-500' },
} as const

export interface StatItemProps extends StatItemData {
  size?: StatSize
  colorScheme?: 'light' | 'dark'
  showAccentBorder?: boolean
  className?: string
}

export const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  icon,
  size = 'lg',
  colorScheme = 'dark',
  showAccentBorder = true,
  className,
}) => {
  const sizes = sizeClasses[size]
  const colors = colorClasses[colorScheme]
  const { displayValue, ref } = useAnimatedValue(value)

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-1',
        showAccentBorder && 'border-l-4 border-primary pl-5',
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            'mb-1 flex h-10 w-10 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5',
            colorScheme === 'dark'
              ? 'bg-white/15 text-white'
              : 'bg-primary/15 text-primary',
          )}
        >
          {icon}
        </div>
      )}
      <span className={cn('font-heading font-bold tabular-nums', sizes.value, colors.value)}>
        {displayValue}
      </span>
      <span className={cn('font-sans', sizes.label, colors.label)}>
        {label}
      </span>
    </div>
  )
}
