'use client'

import { useReducer } from 'react'
import type { MapExplorerPOI, CityCluster, ZoomLevel, MapViewportBounds } from '../types'
import type { ExperienceSearchFilters, FacetValue } from '@/lib/search/types'

export interface MapExplorerState {
  viewport: {
    center: [number, number]
    zoom: number
    bounds: MapViewportBounds | null
  }
  zoomLevel: ZoomLevel
  query: string
  /** Quick-filter: selected experience types (pills) */
  activeTypes: string[]
  /** Advanced filters from the FilterPanel drawer */
  advancedFilters: Partial<ExperienceSearchFilters>
  selectedPOISlug: string | null
  pois: MapExplorerPOI[]
  cityClusters: CityCluster[]
  isLoading: boolean
  totalFound: number
  facets: Record<string, FacetValue[]>
}

/** Serialisable snapshot of search results — stored in history.state for instant back-nav. */
export interface MapResultsSnapshot {
  pois: MapExplorerPOI[]
  cityClusters: CityCluster[]
  totalFound: number
  zoomLevel: ZoomLevel
  facets: Record<string, FacetValue[]>
  selectedPOISlug: string | null
  query: string
  activeTypes: string[]
  advancedFilters: Partial<ExperienceSearchFilters>
}

type Action =
  | { type: 'SET_VIEWPORT'; payload: { center: [number, number]; zoom: number; bounds: MapViewportBounds } }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_ACTIVE_TYPES'; payload: string[] }
  | { type: 'SET_ADVANCED_FILTERS'; payload: Partial<ExperienceSearchFilters> }
  | { type: 'SET_SELECTED_POI'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | {
      type: 'SET_SEARCH_RESULTS'
      payload: {
        pois: MapExplorerPOI[]
        cityClusters: CityCluster[]
        totalFound: number
        zoomLevel: ZoomLevel
        facets: Record<string, FacetValue[]>
      }
    }
  | { type: 'RESTORE_SNAPSHOT'; payload: MapResultsSnapshot }

function reducer(state: MapExplorerState, action: Action): MapExplorerState {
  switch (action.type) {
    case 'SET_VIEWPORT':
      return { ...state, viewport: { ...action.payload } }
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'SET_ACTIVE_TYPES':
      return { ...state, activeTypes: action.payload }
    case 'SET_ADVANCED_FILTERS':
      return { ...state, advancedFilters: action.payload }
    case 'SET_SELECTED_POI':
      return { ...state, selectedPOISlug: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        pois: action.payload.pois,
        cityClusters: action.payload.cityClusters,
        totalFound: action.payload.totalFound,
        zoomLevel: action.payload.zoomLevel,
        facets: action.payload.facets,
        isLoading: false,
      }
    case 'RESTORE_SNAPSHOT':
      return {
        ...state,
        pois: action.payload.pois,
        cityClusters: action.payload.cityClusters,
        totalFound: action.payload.totalFound,
        zoomLevel: action.payload.zoomLevel,
        facets: action.payload.facets,
        selectedPOISlug: action.payload.selectedPOISlug,
        query: action.payload.query,
        activeTypes: action.payload.activeTypes,
        advancedFilters: action.payload.advancedFilters,
        isLoading: false,
      }
    default:
      return state
  }
}

const DEFAULT_CENTER: [number, number] = [42.7339, 25.4858]
const DEFAULT_ZOOM = 7

export interface MapExplorerInitialState {
  center?: [number, number]
  zoom?: number
  query?: string
  poi?: string | null
  /** Pre-populated results from history cache (back-nav). */
  snapshot?: MapResultsSnapshot
}

export function useMapExplorerState(initial?: MapExplorerInitialState) {
  const snap = initial?.snapshot
  const [state, dispatch] = useReducer(reducer, {
    viewport: {
      center: initial?.center ?? DEFAULT_CENTER,
      zoom: initial?.zoom ?? DEFAULT_ZOOM,
      bounds: null,
    },
    zoomLevel: snap?.zoomLevel ?? 'country',
    query: snap?.query ?? initial?.query ?? '',
    activeTypes: snap?.activeTypes ?? [],
    advancedFilters: snap?.advancedFilters ?? {},
    selectedPOISlug: snap?.selectedPOISlug ?? initial?.poi ?? null,
    pois: snap?.pois ?? [],
    cityClusters: snap?.cityClusters ?? [],
    isLoading: false,
    totalFound: snap?.totalFound ?? 0,
    facets: snap?.facets ?? {},
  })

  return { state, dispatch }
}
