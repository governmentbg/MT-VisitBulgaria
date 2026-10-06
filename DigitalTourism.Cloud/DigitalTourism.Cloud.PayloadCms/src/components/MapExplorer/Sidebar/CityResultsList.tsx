'use client'

import Image from 'next/image'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import type { CityCluster } from '../types'

interface CityResultsListProps {
  cityClusters: CityCluster[]
  totalFound: number
  resultsLabel: string
  experiencesLabel: string
  onZoomToCity: (lat: number, lng: number, zoom: number) => void
}

export function CityResultsList({
  cityClusters,
  totalFound,
  resultsLabel,
  experiencesLabel,
  onZoomToCity,
}: CityResultsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-medium text-grey-400">
        <span>{resultsLabel}</span>
        <span>({totalFound})</span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {cityClusters.map((cluster) => (
          <div
            key={cluster.city}
            className="flex cursor-pointer gap-6 rounded-xl border border-grey-200 bg-white p-4 transition-shadow hover:shadow-md"
            onClick={() => onZoomToCity(cluster.location.lat, cluster.location.lng, 13)}
          >
            {/* Text content */}
            <div className="flex flex-1 flex-col gap-3">
              <h4 className="text-base font-bold leading-snug text-grey-900">{cluster.city}</h4>
              <div className="flex items-center gap-2">
                <SpriteIcon name="location" className="h-4 w-4 shrink-0 text-grey-400" />
                <span className="text-xs font-medium text-grey-500">
                  {cluster.count} {experiencesLabel}
                </span>
              </div>
            </div>

            {/* Preview image or initials fallback */}
            <div className="relative h-auto w-[100px] shrink-0 overflow-hidden rounded-xl">
              {cluster.previewImageUrl ? (
                <Image
                  src={cluster.previewImageUrl}
                  alt={cluster.city}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-grey-200 text-xl font-bold text-grey-500">
                  {cluster.city.charAt(0)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
