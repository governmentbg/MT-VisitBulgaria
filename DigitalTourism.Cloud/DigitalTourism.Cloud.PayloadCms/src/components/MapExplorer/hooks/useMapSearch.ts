'use client'

import { useCallback, useEffect, useRef } from 'react'
import { searchMapExperiences } from '@/lib/search/searchMapExperiences'
import type { ExperienceSearchFilters, FacetValue } from '@/lib/search/types'
import type { MapExplorerPOI, CityCluster, MapViewportBounds, ZoomLevel } from '../types'
import { getZoomLevel } from '../types'

interface UseMapSearchOptions {
  locale: string
  bounds: MapViewportBounds | null
  zoom: number
  query: string
  activeTypes: string[]
  advancedFilters: Partial<ExperienceSearchFilters>
  /** Zoom level at which the map switches from city clusters to individual markers. */
  zoomThreshold?: number
  /** When true, skip fetching (e.g. results were restored from history). */
  skip?: boolean
  onResults: (data: {
    pois: MapExplorerPOI[]
    cityClusters: CityCluster[]
    totalFound: number
    zoomLevel: ZoomLevel
    facets: Record<string, FacetValue[]>
  }) => void
}

/** Expand bounds by a percentage (0.15 = 15%) in each direction so markers
 *  outside the visible viewport are pre-fetched and don't pop in on small pans. */
const BBOX_BUFFER = 0.15
function expandBounds(b: MapViewportBounds): MapViewportBounds {
  const latSpan = b.northEast.lat - b.southWest.lat
  const lngSpan = b.northEast.lng - b.southWest.lng
  const latPad = latSpan * BBOX_BUFFER
  const lngPad = lngSpan * BBOX_BUFFER
  return {
    northEast: { lat: b.northEast.lat + latPad, lng: b.northEast.lng + lngPad },
    southWest: { lat: b.southWest.lat - latPad, lng: b.southWest.lng - lngPad },
  }
}

/** Check if viewport is fully contained within a larger (buffered) bbox.
 *  If so, we already have all the data and can skip the search. */
function isContainedIn(viewport: MapViewportBounds, buffered: MapViewportBounds): boolean {
  return (
    viewport.northEast.lat <= buffered.northEast.lat &&
    viewport.northEast.lng <= buffered.northEast.lng &&
    viewport.southWest.lat >= buffered.southWest.lat &&
    viewport.southWest.lng >= buffered.southWest.lng
  )
}

/**
 * Stable spatial sort using fixed grid cells.
 * Snap each coordinate to a ~5 km cell (0.05°), then sort by row → column → title.
 * Because the cell assignment is absolute (not relative to the viewport),
 * the order never changes on pan — only when items enter/leave the result set.
 */
const CELL_SIZE = 0.05
function spatialKey(lat: number, lng: number): number {
  // Interleave row and column into a single comparable number.
  // Row-major: sort north→south first, then west→east within a row.
  const row = Math.floor(lat / CELL_SIZE)
  const col = Math.floor(lng / CELL_SIZE)
  return row * 100000 + col
}

function spatialSort(
  a: { location: { lat: number; lng: number }; title?: string; city?: string },
  b: { location: { lat: number; lng: number }; title?: string; city?: string },
): number {
  const cellA = spatialKey(a.location.lat, a.location.lng)
  const cellB = spatialKey(b.location.lat, b.location.lng)
  if (cellA !== cellB) return cellB - cellA // north → south (higher lat first)
  // Within the same cell, sort alphabetically for stability
  const nameA = a.title ?? a.city ?? ''
  const nameB = b.title ?? b.city ?? ''
  return nameA.localeCompare(nameB)
}

export function useMapSearch({
  locale,
  bounds,
  zoom,
  query,
  activeTypes,
  advancedFilters,
  zoomThreshold,
  skip,
  onResults,
}: UseMapSearchOptions) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)
  const onResultsRef = useRef(onResults)
  onResultsRef.current = onResults
  // Track the last buffered bbox we actually searched so we can skip
  // re-fetching when the viewport is still inside it.
  const lastSearchedRef = useRef<{
    bufferedBounds: MapViewportBounds
    zoom: number
    query: string
    activeTypes: string[]
    advancedFilters: Partial<ExperienceSearchFilters>
  } | null>(null)

  const fetchResults = useCallback(() => {
    if (!bounds || skip) return

    const zoomLevel = getZoomLevel(zoom, zoomThreshold)
    const groupByCity = zoomLevel === 'country'
    // Expand the viewport bbox so markers just outside the screen
    // are already loaded — prevents pop-in on small pans.
    const buffered = expandBounds(bounds)

    // Skip search if the current viewport fits entirely inside the
    // previously searched buffered area and nothing else changed.
    // This is the key optimisation: small pans reuse existing data
    // instead of re-querying Typesense (which may return a different
    // subset due to the perPage limit).
    const last = lastSearchedRef.current
    if (
      last &&
      last.zoom === zoom &&
      last.query === query &&
      last.activeTypes === activeTypes &&
      last.advancedFilters === advancedFilters &&
      isContainedIn(bounds, last.bufferedBounds)
    ) {
      return
    }
    lastSearchedRef.current = { bufferedBounds: buffered, zoom, query, activeTypes, advancedFilters }

    // Increment request ID — any in-flight request with a stale ID
    // will discard its results, giving us effective cancellation.
    const currentRequestId = ++requestIdRef.current

    // Merge type pills + advanced filters
    const mergedType = [
      ...(activeTypes.length > 0 ? activeTypes : []),
      ...(advancedFilters.type ?? []),
    ]
    const uniqueTypes = [...new Set(mergedType)]

    const filters: ExperienceSearchFilters = {
      ...advancedFilters,
      type: uniqueTypes.length > 0 ? uniqueTypes : undefined,
      geoBoundingBox: {
        topLeft: { lat: buffered.northEast.lat, lng: buffered.southWest.lng },
        bottomRight: { lat: buffered.southWest.lat, lng: buffered.northEast.lng },
      },
    }

    searchMapExperiences({
      query: query || undefined,
      locale,
      groupByCity,
      filters,
    }).then((result) => {
      // Discard if a newer request has been issued
      if (currentRequestId !== requestIdRef.current) return

      const seen = new Set<string>()
      const pois: MapExplorerPOI[] = result.hits
        .filter((h) => h.location?.coordinates)
        .filter((h) => {
          if (seen.has(h.id)) return false
          seen.add(h.id)
          return true
        })
        .map((h) => ({
          id: h.id,
          title: h.title,
          slug: h.slug,
          type: h.type,
          categories: h.categories,
          location: {
            lat: h.location!.coordinates!.latitude,
            lng: h.location!.coordinates!.longitude,
          },
          city: h.location?.city,
          heroImageUrl: h.heroImage?.url,
          heroImageAlt: h.heroImage?.alt,
        }))
        .sort(spatialSort)

      const cityClusters: CityCluster[] = (result.cityGroups ?? [])
        .sort(spatialSort)

      onResultsRef.current({
        pois,
        cityClusters,
        totalFound: result.found,
        zoomLevel,
        facets: result.facets ?? {},
      })
    })
  }, [bounds, zoom, query, activeTypes, advancedFilters, zoomThreshold, locale, skip])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(fetchResults, 150)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fetchResults])

  return { requestId: requestIdRef }
}
