'use client'

import { useTranslations } from 'next-intl'
import { MapCanvas } from '../MapCanvas/MapCanvas'
import { MapControls } from '../MapCanvas/MapControls'
import { ExperienceMarker } from '../MapCanvas/ExperienceMarker'
import { FitBoundsHandler } from './FitBoundsHandler'
import type { MapExplorerPOI } from '../types'

export interface StaticMapClientProps {
  pois: MapExplorerPOI[]
  center: [number, number]
  zoom: number
  fitBounds?: {
    northEast: { lat: number; lng: number }
    southWest: { lat: number; lng: number }
  }
  height: 'sm' | 'md' | 'lg'
  highlightSlug?: string
  /** False renders a frozen preview — see EmbeddedMap. */
  interactive?: boolean
}

export { HEIGHT_CLASSES } from './heights'

export function StaticMapClient({
  pois,
  center,
  zoom,
  fitBounds,
  height: _height,
  highlightSlug,
  interactive = true,
}: StaticMapClientProps) {
  const t = useTranslations('mapExplorer')
  return (
    <div className="relative h-full w-full">
      <MapCanvas center={center} zoom={zoom} interactive={interactive}>
        {interactive && <MapControls />}
        {fitBounds && <FitBoundsHandler bounds={fitBounds} />}
        {pois.map((poi) => (
          <ExperienceMarker
            key={poi.id}
            poi={poi}
            isSelected={poi.slug === highlightSlug}
            viewMoreLabel={t('viewMore')}
            directionsLabel={t('getDirections')}
          />
        ))}
      </MapCanvas>
    </div>
  )
}
