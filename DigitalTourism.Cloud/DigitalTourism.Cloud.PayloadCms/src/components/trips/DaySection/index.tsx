'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/components/ui/theme/cn'
import { ChevronUpRegular, MapRegular } from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { SortableDestinationItem } from '../DestinationItem/SortableDestinationItem'
import { AddButton } from '../AddButton'
import type { DestinationItemData } from '../types'
import { useTranslations } from 'next-intl'

/**
 * Minimal isolated component for DnD container.
 * Keeps useSortable in a simple render tree to prevent re-render cascades.
 * Exposes `isOver` via callback so parent can auto-expand collapsed days.
 */
function SortableList({
  id,
  items,
  children,
  collapsed,
  onIsOverChange,
}: {
  id: string
  items: string[]
  children: React.ReactNode
  collapsed?: boolean
  onIsOverChange?: (isOver: boolean) => void
}) {
  const { setNodeRef, isOver } = useSortable({ id })

  useEffect(() => {
    onIsOverChange?.(isOver)
  }, [isOver])

  if (collapsed) {
    return (
      <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} />
      </SortableContext>
    )
  }

  return (
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="flex flex-col">
        {children}
      </div>
    </SortableContext>
  )
}

export interface DaySectionProps {
  dayNumber: number
  destinations: DestinationItemData[]
  /** Sortable uid list for DnD — must match order of destinations */
  sortableIds?: string[]
  isCollapsed?: boolean
  onToggle?: () => void
  onAddDestination: (dayNumber: number) => void
  onDeleteDestination?: (destination: DestinationItemData) => void
  onViewInfo?: (destination: DestinationItemData) => void
  onAddToFavorites?: (destination: DestinationItemData) => void
  /** Check if a destination is favorited — receives the experience key */
  isFavorite?: (destination: DestinationItemData) => boolean
  onMoveToDay?: (destination: DestinationItemData, targetDay: number) => void
  /** Total days — passed to context menu for move dialog */
  dayCount?: number
  /** Trip start date — passed to move dialog */
  tripStartDate?: string
  highlightedId?: string | number
  className?: string
}

export const DaySection: React.FC<DaySectionProps> = ({
  dayNumber,
  destinations,
  sortableIds = [],
  isCollapsed: controlledCollapsed,
  onToggle,
  onAddDestination,
  onDeleteDestination,
  onViewInfo,
  onAddToFavorites,
  isFavorite,
  onMoveToDay,
  dayCount,
  tripStartDate,
  highlightedId,
  className,
}) => {
  const t = useTranslations('tripPlanner')
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const isCollapsed = controlledCollapsed ?? internalCollapsed
  const handleToggle = onToggle ?? (() => setInternalCollapsed((c) => !c))
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const containerId = `day-${dayNumber}`

  // Auto-expand when dragging over a collapsed day
  const handleIsOverChange = (isOver: boolean) => {
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current)
      expandTimerRef.current = null
    }
    if (isOver && isCollapsed) {
      expandTimerRef.current = setTimeout(() => {
        if (onToggle) {
          onToggle()
        } else {
          setInternalCollapsed(false)
        }
      }, 600)
    }
  }

  useEffect(() => {
    return () => {
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current)
    }
  }, [])

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header */}
      <button
        onClick={handleToggle}
        className="flex w-full items-center gap-2 px-8 max-sm:px-4 py-4 text-left transition-colors hover:bg-grey-25"
      >
        <div className="flex flex-1 items-center gap-4">
          {/* Icon in 33px grey circle */}
          <div className="flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-full bg-grey-100">
            <MapRegular className="h-4 w-4 text-grey-500" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <span className="font-heading text-tagline text-grey-900">{t('dayTitle', { day: dayNumber })}</span>
            <span className="text-xs font-medium text-[#45556c]">
              {destinations.length} {t('destinations', { count: destinations.length })}
            </span>
          </div>
        </div>
        {/* Toggle in 33px grey circle */}
        <div className="flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-full bg-grey-100">
          {isCollapsed ? (
            <SpriteIcon name="chevron-down" className="h-3 w-3 text-grey-500" />
          ) : (
            <ChevronUpRegular className="h-3 w-3 text-grey-500" />
          )}
        </div>
      </button>

      {/* Always render SortableList so collapsed days remain valid drop targets */}
      <div className={cn('flex flex-col ', !isCollapsed && 'pb-4')}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4 px-8 max-sm:px-4">
            <SortableList id={containerId} items={sortableIds} collapsed={isCollapsed} onIsOverChange={handleIsOverChange}>
              {!isCollapsed &&
                destinations.map((destination, index) => (
                  <div key={destination.uid || destination.id}>
                    <SortableDestinationItem
                      id={destination.uid || String(destination.id)}
                      destination={destination}
                      variant="sidebar"
                      dayNumber={dayNumber}
                      stopNumber={index + 1}
                      isHighlighted={highlightedId === destination.id}
                      showConnector
                      onDelete={onDeleteDestination}
                      onViewInfo={onViewInfo}
                      onAddToFavorites={onAddToFavorites}
                      isFavorite={isFavorite?.(destination)}
                      onMoveToDay={onMoveToDay}
                      dayCount={dayCount}
                      tripStartDate={tripStartDate}
                    />
                  </div>
                ))}
            </SortableList>
          </div>
          {!isCollapsed && (
            <div className="px-8 max-sm:px-4">
              <AddButton
                label={t('addDestination')}
                onClick={() => onAddDestination(dayNumber)}
                className="w-full justify-center"
              />
            </div>
          )}
        </div>
        {/* Bottom separator line */}
        <div className="border-b border-grey-100" />
      </div>
    </div>
  )
}
