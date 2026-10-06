'use client'

import { cn } from '@/components/ui/theme/cn'
import { DestinationItem } from '../DestinationItem'
import type { DestinationItemData } from '../types'
import { useTranslations } from 'next-intl'

export interface DestinationListProps {
  destinations: DestinationItemData[]
  variant: 'add' | 'sidebar'
  dayNumber?: number
  onAdd?: (destination: DestinationItemData) => void
  onDelete?: (destination: DestinationItemData) => void
  emptyMessage?: string
  highlightedId?: string | number
  className?: string
}

export const DestinationList: React.FC<DestinationListProps> = ({
  destinations,
  variant,
  dayNumber,
  onAdd,
  onDelete,
  emptyMessage,
  highlightedId,
  className,
}) => {
  const t = useTranslations('tripPlanner')
  const displayMessage = emptyMessage ?? t('noDestinations')

  if (destinations.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8 text-sm text-grey-400', className)}>
        {displayMessage}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col pr-4', className)}>
      {destinations.map((destination, index) => (
        <div key={destination.type ? `${destination.type}_${destination.id}` : `${destination.id}_${index}`}>
          {index > 0 && <div className="mx-3 border-t border-grey-100" />}
          <DestinationItem
            destination={destination}
            variant={variant}
            dayNumber={dayNumber}
            isHighlighted={highlightedId === destination.id}
            onAdd={onAdd}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}
