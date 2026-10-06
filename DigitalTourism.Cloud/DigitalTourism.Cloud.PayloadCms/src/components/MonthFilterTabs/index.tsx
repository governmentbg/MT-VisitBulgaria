'use client'

import * as React from 'react'
import { cn } from '@/components/ui/theme/cn'

export type MonthFilterValue = 'thisMonth' | 'nextMonth'

export interface MonthFilterTabsProps {
  value: MonthFilterValue
  onChange: (value: MonthFilterValue) => void
  labels?: {
    thisMonth?: string
    nextMonth?: string
  }
  variant?: 'light' | 'dark'
  className?: string
}

const MonthFilterTabs: React.FC<MonthFilterTabsProps> = ({
  value,
  onChange,
  labels,
  variant = 'dark',
  className,
}) => {
  const thisMonthLabel = labels?.thisMonth ?? 'This month'
  const nextMonthLabel = labels?.nextMonth ?? 'Next month'

  const isLight = variant === 'light'

  const activeClasses = isLight
    ? 'bg-primary text-white'
    : 'bg-white text-primary-900'
  const inactiveClasses = isLight
    ? 'bg-transparent text-grey-700 hover:bg-grey-50'
    : 'bg-transparent text-white hover:bg-white/10'

  return (
    <div className={cn('flex gap-3', className)}>
      <button
        type="button"
        onClick={() => onChange('thisMonth')}
        className={cn(
          'rounded-full px-9 py-3.5 text-lg font-semibold leading-7 transition-colors',
          value === 'thisMonth' ? activeClasses : inactiveClasses,
        )}
      >
        {thisMonthLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange('nextMonth')}
        className={cn(
          'rounded-full px-9 py-3.5 text-lg font-semibold leading-7 transition-colors',
          value === 'nextMonth' ? activeClasses : inactiveClasses,
        )}
      >
        {nextMonthLabel}
      </button>
    </div>
  )
}

export { MonthFilterTabs }
