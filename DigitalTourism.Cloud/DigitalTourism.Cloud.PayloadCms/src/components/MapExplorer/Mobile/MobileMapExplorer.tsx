'use client'

import { useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { SlidersHorizontal } from 'lucide-react'
import { MapCanvas } from '../MapCanvas/MapCanvas'
import { MapEventHandler, type MapEventHandlerRef } from '../MapCanvas/MapEventHandler'
import { MapControls } from '../MapCanvas/MapControls'
import { CityMarker } from '../MapCanvas/CityMarker'
import { ExperienceMarker } from '../MapCanvas/ExperienceMarker'
import { FilterPanel, FilterContent } from '@/components/filters'
import type { MapExplorerPOI, CityCluster, MapViewportBounds, ZoomLevel } from '../types'
import type { ExperienceSearchFilters } from '@/lib/search/types'
import type { FacetValue } from '@/components/filters'
import type { FacetConfigItem } from '@/utilities/getSettings'

interface MobileMapExplorerProps {
  center: [number, number]
  zoom: number
  zoomLevel: ZoomLevel
  pois: MapExplorerPOI[]
  cityClusters: CityCluster[]
  selectedPOISlug: string | null
  onViewportChange: (bounds: MapViewportBounds, zoom: number) => void
  onSelectPOI: (poi: MapExplorerPOI) => void
  /** Filter state & handlers */
  advancedFilters: ExperienceSearchFilters
  activeTypes: string[]
  facets?: Record<string, FacetValue[]>
  activeFilterCount: number
  hiddenFilters: Set<keyof ExperienceSearchFilters>
  nomenclatureMap: Record<string, { label: string; icon?: string }>
  facetConfig?: FacetConfigItem[]
  onMultiFilter: (key: string, value: string, checked: boolean) => void
  onSingleFilter: (key: string, value: string, checked: boolean) => void
  onClearFilters: () => void
}

export function MobileMapExplorer({
  center,
  zoom,
  zoomLevel,
  pois,
  cityClusters,
  selectedPOISlug,
  onViewportChange,
  onSelectPOI,
  advancedFilters,
  activeTypes,
  facets,
  activeFilterCount,
  hiddenFilters,
  nomenclatureMap,
  facetConfig,
  onMultiFilter,
  onSingleFilter,
  onClearFilters,
}: MobileMapExplorerProps) {
  const t = useTranslations('mapExplorer')
  const mapRef = useRef<MapEventHandlerRef>(null)

  const handleSelectPOI = useCallback(
    (poi: MapExplorerPOI) => {
      onSelectPOI(poi)
      mapRef.current?.flyTo(poi.location.lat, poi.location.lng, Math.max(zoom, 13))
    },
    [onSelectPOI, zoom],
  )

  const handleZoomToCity = useCallback(
    (lat: number, lng: number, targetZoom: number) => {
      mapRef.current?.flyTo(lat, lng, targetZoom)
    },
    [],
  )

  return (
    <div className="relative h-full w-full">
      <MapCanvas center={center} zoom={zoom}>
        <MapEventHandler ref={mapRef} onViewportChange={onViewportChange} />
        <MapControls className="bottom-6" />

        {zoomLevel === 'country'
          ? cityClusters.map((cluster) => (
              <CityMarker key={cluster.city} cluster={cluster} onZoomToCity={handleZoomToCity} />
            ))
          : pois.map((poi) => (
              <ExperienceMarker
                key={poi.id}
                poi={poi}
                isSelected={poi.slug === selectedPOISlug}
                onSelect={handleSelectPOI}
                viewMoreLabel={t('viewMore')}
                directionsLabel={t('getDirections')}
              />
            ))}
      </MapCanvas>

      {/* Floating filter FAB */}
      <div className="absolute bottom-6 left-4 z-20">
        <FilterPanel
          activeFilterCount={activeFilterCount}
          onClearFilters={onClearFilters}
          trigger={
            <button
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-grey-200 bg-white text-grey-700 shadow-lg active:scale-95 transition-transform hover:bg-grey-50"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          }
        >
          <FilterContent
            filters={{
              ...advancedFilters,
              type: activeTypes.length > 0 ? activeTypes : advancedFilters.type,
            }}
            facets={facets}
            onMultiFilter={onMultiFilter}
            onSingleFilter={onSingleFilter}
            onClearFilters={onClearFilters}
            hasActiveFilters={activeFilterCount > 0}
            activeFilterCount={activeFilterCount}
            hiddenFilters={hiddenFilters}
            nomenclatureMap={nomenclatureMap}
            facetConfig={facetConfig}
          />
        </FilterPanel>
      </div>
    </div>
  )
}
