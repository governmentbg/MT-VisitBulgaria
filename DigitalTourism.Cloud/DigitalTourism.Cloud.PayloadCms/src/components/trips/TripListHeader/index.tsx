'use client'

import { cn } from '@/components/ui/theme/cn'
import { Button } from '@/components/ui'
import { AddRegular } from '@/components/ui/icons'
import { useTranslations } from 'next-intl'

export interface TripListHeaderProps {
  title: string
  subtitle?: string
  buttonLabel?: string
  onCreateTrip: () => void
  className?: string
}

export const TripListHeader: React.FC<TripListHeaderProps> = ({
  title,
  subtitle,
  buttonLabel,
  onCreateTrip,
  className,
}) => {
  const t = useTranslations('tripPlanner')
  const label = buttonLabel ?? t('newPlan')

  return (
    <div className={cn('flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex min-w-0 flex-col gap-4">
        <h1 className="font-heading text-h3 text-grey-900">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-md text-body-lg text-grey-500">
            {subtitle}
          </p>
        )}
      </div>

      <Button
        size="xs"
        onClick={onCreateTrip}
        className="shrink-0 rounded-full border border-grey-100 bg-grey-0 text-xs font-bold text-grey-900 shadow-md hover:bg-grey-50"
        icon={
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
            <AddRegular className="h-3 w-3" />
          </span>
        }
      >
        {label}
      </Button>
    </div>
  )
}
