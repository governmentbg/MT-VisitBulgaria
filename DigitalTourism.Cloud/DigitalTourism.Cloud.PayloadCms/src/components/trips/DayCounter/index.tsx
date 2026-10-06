'use client'

import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { useTranslations } from 'next-intl'

export interface DayCounterProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  min?: number
  max?: number
  subtitle?: string
  className?: string
}

export const DayCounter: React.FC<DayCounterProps> = ({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max = 30,
  subtitle,
  className,
}) => {
  const t = useTranslations('tripPlanner')
  const displaySubtitle = subtitle ?? t('addOrRemove')

  return (
    <div className={cn('flex items-center justify-between px-6 py-4', className)}>
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className="flex h-10 w-10 items-center justify-center rounded-full text-grey-600 transition-colors hover:bg-grey-50 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label={t('decreaseDays')}
      >
        <SpriteIcon name="chevron-left" className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-grey-900">
          {value} {t('days', { count: value })}
        </span>
        {displaySubtitle && (
          <span className="text-xs text-grey-400">{displaySubtitle}</span>
        )}
      </div>

      <button
        onClick={onIncrement}
        disabled={value >= max}
        className="flex h-10 w-10 items-center justify-center rounded-full text-grey-600 transition-colors hover:bg-grey-50 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label={t('increaseDays')}
      >
        <SpriteIcon name="chevron-right" className="h-5 w-5" />
      </button>
    </div>
  )
}
