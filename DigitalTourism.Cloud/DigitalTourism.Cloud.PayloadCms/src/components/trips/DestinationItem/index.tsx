'use client'

import { cn } from '@/components/ui/theme/cn'
import { Pill } from '@/components/ui'
import { AddRegular, ReOrderDotsVerticalRegular } from '@/components/ui/icons'
import { DayBadge } from '../DayBadge'
import { DestinationOptionsMenu } from '../DestinationOptionsMenu'
import type { DestinationItemData } from '../types'
import { useTranslations } from 'next-intl'

export interface DestinationItemProps {
  destination: DestinationItemData
  variant: 'add' | 'sidebar'
  dayNumber?: number
  /** Sequential stop number within the day (1, 2, 3…) */
  stopNumber?: number
  isHighlighted?: boolean
  /** Show a dotted connector line below the day badge */
  showConnector?: boolean
  onAdd?: (destination: DestinationItemData) => void
  onDelete?: (destination: DestinationItemData) => void
  onViewInfo?: (destination: DestinationItemData) => void
  onAddToFavorites?: (destination: DestinationItemData) => void
  /** Whether this destination is currently in the user's favorites */
  isFavorite?: boolean
  /** Called with (destination, targetDay) when user picks a day in the move dialog */
  onMoveToDay?: (destination: DestinationItemData, targetDay: number) => void
  /** Total number of days — passed to the move-to-day dialog */
  dayCount?: number
  /** Trip start date — passed to move dialog for day date labels */
  tripStartDate?: string
  /** Ref + listeners to make the day badge act as a drag handle */
  dragHandleRef?: React.Ref<HTMLDivElement>
  dragHandleListeners?: React.HTMLAttributes<HTMLDivElement>
  className?: string
}

export const DestinationItem: React.FC<DestinationItemProps> = ({
  destination,
  variant,
  dayNumber,
  stopNumber,
  isHighlighted,
  showConnector,
  onAdd,
  onDelete,
  onViewInfo,
  onAddToFavorites,
  isFavorite,
  onMoveToDay,
  dayCount,
  tripStartDate,
  dragHandleRef,
  dragHandleListeners,
  className,
}) => {
  const t = useTranslations('tripPlanner')

  return (
    <div
      className={cn(
        'flex items-center justify-between pl-4 py-2 max-sm:px-1 max-sm:py-1 transition-colors',
        isHighlighted && 'rounded-xl border border-grey-100 bg-grey-25',
        className,
      )}
    >
      {/* Left: drag handle (badge + image) + text */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {/* Drag handle zone: badge + thumbnail */}
        {variant === 'sidebar' && dayNumber ? (
          <div
            ref={dragHandleRef}
            {...dragHandleListeners}
            className={cn(
              'flex shrink-0 items-center gap-4',
              dragHandleRef && 'cursor-grab touch-none active:cursor-grabbing',
            )}
          >
            <div className="flex w-[26px] flex-col items-center">
              <DayBadge dayNumber={dayNumber} label={stopNumber} size="sm" />
              {dragHandleRef ? (
                <ReOrderDotsVerticalRegular className="mt-1 h-4 w-4 text-grey-300" />
              ) : showConnector ? (
                <div className="mt-2 flex-1 border-l-2 border-dotted border-grey-200" />
              ) : null}
            </div>
            <div className="h-[54px] w-[54px] shrink-0 overflow-hidden rounded-xl bg-grey-100">
              {destination.imageUrl ? (
                <img
                  src={destination.imageUrl}
                  alt={destination.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-grey-300">
                  —
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-[54px] w-[54px] shrink-0 overflow-hidden rounded-xl bg-grey-100">
            {destination.imageUrl ? (
              <img
                src={destination.imageUrl}
                alt={destination.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-grey-300">
                —
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className={cn(
            'text-base font-bold text-grey-900',
            variant === 'sidebar' ? 'truncate' : 'line-clamp-2',
          )}>
            {destination.title}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {destination.address && (
              <span className="truncate text-xs font-medium text-[#45556c]">
                {destination.address}
              </span>
            )}
            {destination.category && (
              <Pill size="sm" variant="default" className="shrink-0">
                {destination.category}
              </Pill>
            )}
          </div>
        </div>
      </div>

      {/* Action: add button (secondary/outline style) */}
      {variant === 'add' && (
        <button
          onClick={() => onAdd?.(destination)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-grey-200 text-grey-500 transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label={t('addItem', { title: destination.title })}
        >
          <AddRegular className="h-4 w-4" />
        </button>
      )}

      {/* Action: Radix dropdown menu for sidebar items */}
      {variant === 'sidebar' && (
        <DestinationOptionsMenu
          onDelete={onDelete ? () => onDelete(destination) : undefined}
          onViewInfo={onViewInfo ? () => onViewInfo(destination) : undefined}
          onAddToFavorites={onAddToFavorites ? () => onAddToFavorites(destination) : undefined}
          isFavorite={isFavorite}
          onMoveToDay={onMoveToDay ? (targetDay) => onMoveToDay(destination, targetDay) : undefined}
          coordinates={destination.coordinates}
          dayCount={dayCount}
          currentDay={dayNumber}
          destinationTitle={destination.title}
          tripStartDate={tripStartDate}
        />
      )}
    </div>
  )
}
