'use client'

import { cn } from '@/components/ui/theme/cn'
import { TripListHeader } from '../TripListHeader'
import { useTranslations } from 'next-intl'

export interface TripEmptyStateProps {
  onCreateTrip: () => void
  className?: string
}

export const TripEmptyState: React.FC<TripEmptyStateProps> = ({
  onCreateTrip,
  className,
}) => {
  const t = useTranslations('tripPlanner')

  return (
    <div className={cn(className)}>
      <TripListHeader
        title={t('myTrips')}
        subtitle={t('noTripsMessage')}
        onCreateTrip={onCreateTrip}
      />
    </div>
  )
}
