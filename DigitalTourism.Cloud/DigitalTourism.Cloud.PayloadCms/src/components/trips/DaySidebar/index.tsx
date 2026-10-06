'use client'

import { useRef, useCallback } from 'react'
import { cn } from '@/components/ui/theme/cn'
import { DaySection } from '../DaySection'
import { DayCounter } from '../DayCounter'
import type { TripDay, DestinationItemData } from '../types'
import { useTranslations } from 'next-intl'

export interface DaySidebarProps {
  days: TripDay[]
  dayCount: number
  onDayCountChange: (delta: number) => void
  onAddDestination: (dayNumber: number) => void
  onDeleteDestination?: (destination: DestinationItemData) => void
  onViewInfo?: (destination: DestinationItemData) => void
  onAddToFavorites?: (destination: DestinationItemData) => void
  /** Check if a destination is favorited */
  isFavorite?: (destination: DestinationItemData) => boolean
  onMoveToDay?: (destination: DestinationItemData, targetDay: number) => void
  /** Trip start date — passed to move dialog */
  tripStartDate?: string
  /** Map of day container ID → sortable uid list for DnD */
  itemIds?: Record<string, string[]>
  highlightedId?: string | number
  /** Called with scroll direction and current scrollTop. */
  onScrollDirection?: (direction: 'up' | 'down', scrollTop: number) => void
  /** Height of the mobile header overlay — used as padding-top on mobile */
  mobileHeaderHeight?: number
  className?: string
}

export const DaySidebar: React.FC<DaySidebarProps> = ({
  days,
  dayCount,
  onDayCountChange,
  onAddDestination,
  onDeleteDestination,
  onViewInfo,
  onAddToFavorites,
  isFavorite,
  onMoveToDay,
  tripStartDate,
  itemIds,
  highlightedId,
  onScrollDirection,
  mobileHeaderHeight = 0,
  className,
}) => {
  const t = useTranslations('tripPlanner')
  const lastScrollTop = useRef(0)
  const accumulatedDelta = useRef(0)
  const lastDirection = useRef<'up' | 'down' | null>(null)

  const hideThreshold = mobileHeaderHeight * 2 || 80

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!onScrollDirection) return
      // Only track scroll direction on mobile (matches max-sm: breakpoint)
      if (window.innerWidth > 640) return
      const scrollTop = e.currentTarget.scrollTop
      const delta = scrollTop - lastScrollTop.current
      lastScrollTop.current = scrollTop

      // Always show header when scrolled near the top
      if (scrollTop < hideThreshold) {
        onScrollDirection('up', scrollTop)
        return
      }

      const direction = delta > 0 ? 'down' : 'up'

      // Reset accumulator when direction changes
      if (direction !== lastDirection.current) {
        accumulatedDelta.current = 0
        lastDirection.current = direction
      }

      accumulatedDelta.current += Math.abs(delta)

      // Hide after scrolling past 2x header height, show after sustained 40px scroll up
      if (direction === 'down' && accumulatedDelta.current > 10) {
        onScrollDirection('down', scrollTop)
      } else if (direction === 'up' && accumulatedDelta.current > 40) {
        onScrollDirection('up', scrollTop)
      }
    },
    [onScrollDirection, hideThreshold],
  )
  // Convert TripDay stops to DestinationItemData for display
  const getDayDestinations = (day: TripDay): DestinationItemData[] => {
    const uids = itemIds?.[`day-${day.dayNumber}`]
    return day.stops.map((stop, index) => {
      const exp = stop.experience
      const value = typeof exp.value === 'object' ? exp.value : null
      const v = value as any
      const address = v?.city?.name || v?.location?.city || v?.address || ''
      const imageUrl =
        v?.heroImage?.sizes?.thumbnail?.url ||
        v?.heroImage?.url ||
        ''
      return {
        id: v ? String(v.id ?? index) : String(index),
        uid: uids?.[index],
        title: v ? String(v.title ?? v.name ?? t('unknownExperience')) : t('unknownExperience'),
        slug: v?.slug || undefined,
        address: address || undefined,
        category: v?.type || exp.relationTo,
        imageUrl: imageUrl || undefined,
        type: v?.type || exp.relationTo,
      }
    })
  }

  return (
    <div
      className={cn(
        'flex h-full w-[635px] flex-col bg-white shadow-3xl',
        'max-md:w-[400px]',
        'max-lg:w-[450px]',
        'max-sm:w-full',
        className,
      )}
    >
      {/* Scrollable day sections */}
      <div className="flex-1 overflow-y-auto pb-8" onScroll={handleScroll}>
        {/* Mobile spacer for the absolute-positioned header overlay */}
        {mobileHeaderHeight > 0 && (
          <div className="hidden max-sm:block" style={{ height: mobileHeaderHeight }} />
        )}
        {days.map((day) => {
          const dayId = `day-${day.dayNumber}`
          const sortableIds = itemIds?.[dayId] || []
          return (
            <DaySection
              key={day.dayNumber}
              dayNumber={day.dayNumber}
              destinations={getDayDestinations(day)}
              sortableIds={sortableIds}
              onAddDestination={onAddDestination}
              onDeleteDestination={onDeleteDestination}
              onViewInfo={onViewInfo}
              onAddToFavorites={onAddToFavorites}
              isFavorite={isFavorite}
              onMoveToDay={onMoveToDay}
              dayCount={dayCount}
              tripStartDate={tripStartDate}
              highlightedId={highlightedId}
            />
          )
        })}
      </div>

      {/* Fixed bottom counter — hidden on mobile, actions moved to header menu */}
      <div className="border-t border-grey-100 max-sm:hidden">
        <DayCounter
          value={dayCount}
          onIncrement={() => onDayCountChange(1)}
          onDecrement={() => onDayCountChange(-1)}
        />
      </div>
    </div>
  )
}
