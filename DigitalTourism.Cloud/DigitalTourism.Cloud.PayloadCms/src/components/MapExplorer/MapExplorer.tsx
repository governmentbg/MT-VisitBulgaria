'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { SlidersHorizontal } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useMapExplorerState, type MapResultsSnapshot } from './hooks/useMapExplorerState'
import { useMapSearch } from './hooks/useMapSearch'
import { useMapDeepLink, parseDeepLinkParams, getHistorySnapshot } from './hooks/useMapDeepLink'
import { getZoomLevel, type MapViewportBounds, type MapExplorerPOI } from './types'
import type { ExperienceSearchFilters } from '@/lib/search/types'

/** Type filter is handled by the TypeFilterChips pills — hide it from the drawer. */
const HIDDEN_FILTER_KEYS = new Set<keyof ExperienceSearchFilters>(['type'])

// Map components
import { MapCanvas } from './MapCanvas/MapCanvas'
import { MapEventHandler, type MapEventHandlerRef } from './MapCanvas/MapEventHandler'
import { MapControls } from './MapCanvas/MapControls'
import { CityMarker } from './MapCanvas/CityMarker'
import { ExperienceMarker } from './MapCanvas/ExperienceMarker'

// Sidebar components
import { MapExplorerSidebar } from './Sidebar/MapExplorerSidebar'
import { TypeFilterChips } from './Sidebar/TypeFilterChips'
import { ResultsList } from './Sidebar/ResultsList'
import { CityResultsList } from './Sidebar/CityResultsList'

// Filter components (reused from experience listing)
import { FilterPanel, FilterContent } from '@/components/filters'
import type { FacetConfigItem } from '@/utilities/getSettings'

// Mobile components
import { MobileMapExplorer } from './Mobile/MobileMapExplorer'

export interface MapExplorerProps {
  title?: string
  locale: string
  initialCenter?: [number, number]
  initialZoom?: number
  nomenclatureMap?: Record<string, { label: string; icon?: string }>
  zoomThreshold?: number
  facetConfig?: FacetConfigItem[]
}

/** Build a snapshot of the current results state for history caching. */
function buildSnapshot(state: {
  pois: MapExplorerPOI[]
  cityClusters: unknown[]
  totalFound: number
  zoomLevel: string
  facets: Record<string, unknown[]>
  selectedPOISlug: string | null
  query: string
  activeTypes: string[]
  advancedFilters: Partial<ExperienceSearchFilters>
}): MapResultsSnapshot {
  return {
    pois: state.pois,
    cityClusters: state.cityClusters as MapResultsSnapshot['cityClusters'],
    totalFound: state.totalFound,
    zoomLevel: state.zoomLevel as MapResultsSnapshot['zoomLevel'],
    facets: state.facets as MapResultsSnapshot['facets'],
    selectedPOISlug: state.selectedPOISlug,
    query: state.query,
    activeTypes: state.activeTypes,
    advancedFilters: state.advancedFilters,
  }
}

export function MapExplorer({
  title,
  locale: localeProp,
  initialCenter,
  initialZoom,
  nomenclatureMap = {},
  zoomThreshold,
  facetConfig,
}: MapExplorerProps) {
  const t = useTranslations('mapExplorer')
  const tExp = useTranslations('experienceListing')
  const intlLocale = useLocale()
  const locale = localeProp || intlLocale
  const mapRef = useRef<MapEventHandlerRef>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const [sidebarEl, setSidebarEl] = useState<HTMLElement | null>(null)

  // Read URL params synchronously so the reducer starts with the correct
  // state — this avoids the race where the map's initial viewport event
  // fires before an effect-based deep-link read, wiping the URL.
  const searchParams = useSearchParams()
  // Check for a cached snapshot in history.state (back-nav). If present,
  // feed it into the reducer init so results render immediately without a fetch.
  const deepLinkInit = useMemo(
    () => {
      const dl = parseDeepLinkParams(searchParams)
      const snapshot = getHistorySnapshot() as MapResultsSnapshot | undefined
      return {
        center: dl.center ?? initialCenter,
        zoom: dl.zoom ?? initialZoom,
        query: dl.query,
        poi: dl.poi,
        snapshot,
      }
    },
    // Only compute once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { state, dispatch } = useMapExplorerState(deepLinkInit)
  const [skipSearch, setSkipSearch] = useState(() => !!deepLinkInit.snapshot)

  const displayTitle = title || t('title')

  const typeLabels: Record<string, string> = {
    hotel: tExp('typeHotel'),
    restaurant: tExp('typeRestaurant'),
    activity: tExp('typeActivity'),
    attraction: tExp('typeAttraction'),
    event: tExp('typeEvent'),
  }

  // Sidebar ref callback to capture the element for FilterPanel container
  const sidebarRefCallback = useCallback((node: HTMLElement | null) => {
    sidebarRef.current = node
    setSidebarEl(node)
  }, [])

  // Deep link — state is already initialized from URL params above,
  // so we only need popstate handling for back/forward navigation.
  const { updateURL } = useMapDeepLink({
    onPopState: (deepLink) => {
      const snap = deepLink.snapshot as MapResultsSnapshot | undefined
      if (snap) {
        // Restore full state from cached snapshot — no refetch needed.
        dispatch({ type: 'RESTORE_SNAPSHOT', payload: snap })
        setSkipSearch(true)
      } else {
        // No snapshot — just restore POI selection, search will re-run.
        dispatch({ type: 'SET_SELECTED_POI', payload: deepLink.poi ?? null })
      }
    },
  })

  // Search
  useMapSearch({
    locale,
    bounds: state.viewport.bounds,
    zoom: state.viewport.zoom,
    query: state.query,
    activeTypes: state.activeTypes,
    advancedFilters: state.advancedFilters,
    zoomThreshold,
    skip: skipSearch,
    onResults: useCallback(
      ({ pois, cityClusters, totalFound, zoomLevel, facets }) => {
        dispatch({
          type: 'SET_SEARCH_RESULTS',
          payload: { pois, cityClusters, totalFound, zoomLevel, facets },
        })
      },
      [dispatch],
    ),
  })

  // Handlers
  const handleViewportChange = useCallback(
    (bounds: MapViewportBounds, zoom: number) => {
      // First user-initiated viewport change clears the skip flag so
      // future viewport changes trigger searches normally.
      setSkipSearch(false)
      const center: [number, number] = [
        (bounds.northEast.lat + bounds.southWest.lat) / 2,
        (bounds.northEast.lng + bounds.southWest.lng) / 2,
      ]
      const isCountry = getZoomLevel(zoom, zoomThreshold) === 'country'
      if (isCountry && state.selectedPOISlug) {
        dispatch({ type: 'SET_SELECTED_POI', payload: null })
      }
      dispatch({ type: 'SET_VIEWPORT', payload: { center, zoom, bounds } })
      updateURL({
        center,
        zoom,
        query: state.query,
        poi: isCountry ? undefined : state.selectedPOISlug,
        snapshot: buildSnapshot(state),
      })
    },
    [dispatch, updateURL, state],
  )

  const handleSelectPOI = useCallback(
    (poi: MapExplorerPOI) => {
      dispatch({ type: 'SET_SELECTED_POI', payload: poi.slug })
      const currentZoom = state.viewport.zoom
      const map = mapRef.current?.getMap?.()

      if (map) {
        // Offset the flyTo target so the POI lands in the centre of the
        // *visible* map area (to the right of the sidebar), not the full container.
        const sidebarWidth = sidebarRef.current?.offsetWidth ?? 0
        const poiPoint = map.project(L.latLng(poi.location.lat, poi.location.lng), currentZoom)
        // Shift map centre to the left by half the sidebar width so the POI
        // appears in the middle of the exposed map area.
        const offsetPoint = L.point(poiPoint.x - sidebarWidth / 2, poiPoint.y - 200)
        const offsetLatLng = map.unproject(offsetPoint, currentZoom)

        mapRef.current?.flyTo(offsetLatLng.lat, offsetLatLng.lng, currentZoom)

        // Pre-calculate the next bbox for immediate search
        const halfSize = map.getSize().divideBy(2)
        const sw = map.unproject(offsetPoint.subtract(halfSize), currentZoom)
        const ne = map.unproject(offsetPoint.add(halfSize), currentZoom)
        const predictedBounds: MapViewportBounds = {
          northEast: { lat: ne.lat, lng: ne.lng },
          southWest: { lat: sw.lat, lng: sw.lng },
        }
        const center: [number, number] = [offsetLatLng.lat, offsetLatLng.lng]
        dispatch({ type: 'SET_VIEWPORT', payload: { center, zoom: currentZoom, bounds: predictedBounds } })
        updateURL({
          center,
          zoom: currentZoom,
          query: state.query,
          poi: poi.slug,
          snapshot: buildSnapshot({ ...state, selectedPOISlug: poi.slug }),
        })
      } else {
        mapRef.current?.flyTo(poi.location.lat, poi.location.lng, currentZoom)
      }
    },
    [dispatch, state, updateURL],
  )

  const handleTypeChange = useCallback(
    (types: string[]) => {
      dispatch({ type: 'SET_ACTIVE_TYPES', payload: types })
    },
    [dispatch],
  )

  const handleMultiFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      const prev = state.advancedFilters
      const existing = (prev[key as keyof ExperienceSearchFilters] as string[] | undefined) ?? []
      const next = checked ? [...existing, value] : existing.filter((v) => v !== value)
      dispatch({
        type: 'SET_ADVANCED_FILTERS',
        payload: { ...prev, [key]: next.length > 0 ? next : undefined },
      })
    },
    [dispatch, state.advancedFilters],
  )

  const handleSingleFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      const prev = state.advancedFilters
      dispatch({
        type: 'SET_ADVANCED_FILTERS',
        payload: { ...prev, [key]: checked ? [value] : undefined },
      })
    },
    [dispatch, state.advancedFilters],
  )

  const handleClearFilters = useCallback(() => {
    dispatch({ type: 'SET_ADVANCED_FILTERS', payload: {} })
    dispatch({ type: 'SET_ACTIVE_TYPES', payload: [] })
  }, [dispatch])

  const activeFilterCount =
    state.activeTypes.length +
    Object.values(state.advancedFilters).filter(
      (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true),
    ).length

  const handleZoomToCity = useCallback(
    (lat: number, lng: number, zoom: number) => {
      mapRef.current?.flyTo(lat, lng, zoom)
    },
    [],
  )

  // Map markers
  const mapMarkers =
    state.zoomLevel === 'country'
      ? state.cityClusters.map((cluster) => (
          <CityMarker key={cluster.city} cluster={cluster} onZoomToCity={handleZoomToCity} />
        ))
      : state.pois.map((poi) => (
          <ExperienceMarker
            key={poi.id}
            poi={poi}
            isSelected={poi.slug === state.selectedPOISlug}
            onSelect={handleSelectPOI}
            viewMoreLabel={t('viewMore')}
            directionsLabel={t('getDirections')}
          />
        ))

  const sidebarControls = (
    <TypeFilterChips
      facets={state.facets?.type ?? []}
      activeTypes={state.activeTypes}
      allLabel={t('all')}
      typeLabels={typeLabels}
      onTypeChange={handleTypeChange}
    />
  )

  const sidebarHeaderAction = (
    <FilterPanel
      activeFilterCount={activeFilterCount}
      onClearFilters={handleClearFilters}
      container={sidebarEl}
      trigger={
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-grey-200 bg-white text-grey-700 transition-colors hover:bg-grey-50"
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
          ...state.advancedFilters,
          type: state.activeTypes.length > 0 ? state.activeTypes : state.advancedFilters.type,
        }}
        facets={state.facets}
        onMultiFilter={handleMultiFilter}
        onSingleFilter={handleSingleFilter}
        onClearFilters={handleClearFilters}
        hasActiveFilters={activeFilterCount > 0}
        activeFilterCount={activeFilterCount}
        hiddenFilters={HIDDEN_FILTER_KEYS}
        nomenclatureMap={nomenclatureMap}
        facetConfig={facetConfig}
      />
    </FilterPanel>
  )

  const sidebarResults =
    state.zoomLevel === 'country' ? (
      <CityResultsList
        cityClusters={state.cityClusters}
        totalFound={state.totalFound}
        resultsLabel={t('results')}
        experiencesLabel={t('experiences')}
        onZoomToCity={handleZoomToCity}
      />
    ) : (
      <ResultsList
        pois={state.pois}
        selectedSlug={state.selectedPOISlug}
        totalFound={state.totalFound}
        resultsLabel={t('results')}
        typeLabels={typeLabels}
        onSelectPOI={handleSelectPOI}
      />
    )

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Desktop layout — map full width, sidebar floating */}
      <div className="hidden h-full md:block">
        {/* Full-width map */}
        <MapCanvas center={state.viewport.center} zoom={state.viewport.zoom}>
          <MapEventHandler ref={mapRef} onViewportChange={handleViewportChange} />
          <MapControls />
          {mapMarkers}
        </MapCanvas>

        {/* Floating sidebar */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-stretch p-4">
          <MapExplorerSidebar
            ref={sidebarRefCallback}
            title={displayTitle}
            subtitle={t('subtitle')}
            headerAction={sidebarHeaderAction}
            controls={sidebarControls}
          >
            {sidebarResults}
          </MapExplorerSidebar>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="h-full md:hidden">
        <MobileMapExplorer
          center={state.viewport.center}
          zoom={state.viewport.zoom}
          zoomLevel={state.zoomLevel}
          pois={state.pois}
          cityClusters={state.cityClusters}
          selectedPOISlug={state.selectedPOISlug}
          onViewportChange={handleViewportChange}
          onSelectPOI={handleSelectPOI}
          advancedFilters={state.advancedFilters}
          activeTypes={state.activeTypes}
          facets={state.facets}
          activeFilterCount={activeFilterCount}
          hiddenFilters={HIDDEN_FILTER_KEYS}
          nomenclatureMap={nomenclatureMap}
          facetConfig={facetConfig}
          onMultiFilter={handleMultiFilter}
          onSingleFilter={handleSingleFilter}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  )
}
