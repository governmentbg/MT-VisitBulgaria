'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import type { MapExplorerPOI } from '../types'

interface ResultsListProps {
  pois: MapExplorerPOI[]
  selectedSlug: string | null
  totalFound: number
  resultsLabel: string
  typeLabels: Record<string, string>
  onSelectPOI: (poi: MapExplorerPOI) => void
}

export function ResultsList({
  pois,
  selectedSlug,
  totalFound,
  resultsLabel,
  typeLabels,
  onSelectPOI,
}: ResultsListProps) {
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedSlug || !selectedRef.current) return

    // Small delay to let React commit the ref before measuring
    requestAnimationFrame(() => {
      const el = selectedRef.current
      if (!el) return
      const container = el.closest<HTMLElement>('[data-results-scroll]')
      if (!container) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        return
      }

      const GAP = 16 // overshoot so shadow isn't clipped
      const elRect = el.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Check if element is already fully visible (with gap clearance)
      const isAbove = elRect.top < containerRect.top + GAP
      const isBelow = elRect.bottom > containerRect.bottom - GAP

      if (!isAbove && !isBelow) return // already visible

      if (isAbove) {
        // Scroll up — position element GAP px below the container top
        const target = container.scrollTop + (elRect.top - containerRect.top) - GAP
        container.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
      } else {
        // Scroll down — position element GAP px above the container bottom
        const target = container.scrollTop + (elRect.bottom - containerRect.bottom) + GAP
        container.scrollTo({ top: target, behavior: 'smooth' })
      }
    })
  }, [selectedSlug])

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-medium text-grey-400">
        <span>{resultsLabel}</span>
        <span>({totalFound})</span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {pois.map((poi) => {
          const isSelected = poi.slug === selectedSlug
          return (
            <div
              key={poi.id}
              ref={isSelected ? selectedRef : undefined}
              className={cn(
                'flex cursor-pointer gap-6 rounded-xl border border-grey-200 bg-white p-4 transition-shadow hover:shadow-md',
                isSelected && 'ring-2 ring-primary',
              )}
              onClick={() => onSelectPOI(poi)}
            >
              {/* Text content */}
              <div className="flex flex-1 flex-col gap-3">
                <span className="text-xs font-medium text-grey-500">
                  {typeLabels[poi.type] || poi.type}
                </span>
                <h4 className="text-base font-bold leading-snug text-grey-900">{poi.title}</h4>
                {poi.city && (
                  <div className="flex items-center gap-2">
                    <SpriteIcon name="location" className="h-4 w-4 shrink-0 text-grey-400" />
                    <span className="text-xs font-medium text-grey-500">{poi.city}</span>
                  </div>
                )}
              </div>

              {/* Image or initials fallback */}
              <div className="relative h-auto w-[100px] shrink-0 overflow-hidden rounded-xl">
                {poi.heroImageUrl ? (
                  <Image
                    src={poi.heroImageUrl}
                    alt={poi.heroImageAlt || poi.title}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-grey-200 text-xl font-bold text-grey-500">
                    {poi.title.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
