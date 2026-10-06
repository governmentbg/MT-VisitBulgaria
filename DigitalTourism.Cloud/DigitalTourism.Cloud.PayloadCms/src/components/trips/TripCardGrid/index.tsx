'use client'

import { cn } from '@/components/ui/theme/cn'
import { Grid } from '@/components/ui'
import { TripCard } from '../TripCard'
import type { TripSummary } from '../types'

export interface TripCardGridProps {
  trips: TripSummary[]
  onOpenTrip?: (trip: TripSummary) => void
  onDeleteTrip?: (trip: TripSummary) => void
  onDownloadTrip?: (trip: TripSummary) => void
  downloadingTripId?: string | null
  /** @deprecated Use onOpenTrip instead */
  onEditTrip?: (trip: TripSummary) => void
  className?: string
}

export const TripCardGrid: React.FC<TripCardGridProps> = ({
  trips,
  onOpenTrip,
  onDeleteTrip,
  onDownloadTrip,
  downloadingTripId,
  onEditTrip,
  className,
}) => {
  return (
    <Grid cols={3} gap="none" className={cn('gap-3', className)}>
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onOpen={onOpenTrip}
          onEdit={onEditTrip}
          onDelete={onDeleteTrip}
          onDownload={onDownloadTrip}
          isDownloading={downloadingTripId === trip.id}
        />
      ))}
    </Grid>
  )
}
