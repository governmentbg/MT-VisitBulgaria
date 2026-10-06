import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {searchApi} from '../../services/api/searchApi';
import {
  regionToGeoBbox,
  ZOOM_THRESHOLD,
} from '../../utils/mapHelpers';
import {CACHE_TIMES} from '../../constants';
import {queryKeys} from '../../utils/queryKeys';
import {stableFilterKey} from './useSearch';
import type {Region} from '../../models/Location';
import type {
  SearchFilters,
  FacetValue,
  ExperienceSearchResult,
} from '../../services/api/types/searchTypes';

interface UseMapSearchParams {
  region: Region | null;
  zoom: number;
  filters?: SearchFilters;
  query?: string;
}

export interface MapSearchMarker {
  id: string;
  title: string;
  type: string;
  latitude: number;
  longitude: number;
  heroImageUrl?: string;
  cityName?: string;
  descriptionShort?: string;
}

export interface MapSearchCity {
  name: string;
  count: number;
}

export interface MapSearchResult {
  /** Individual markers for city zoom level */
  markers: MapSearchMarker[];
  /** City clusters for country zoom level */
  cities: MapSearchCity[];
  /** Facet counts for filters, keyed by Typesense field name */
  facets: Record<string, FacetValue[]>;
  /** Total found */
  found: number;
  /** Whether we're in city mode (zoomed in) */
  isCityLevel: boolean;
}

function hitToMarker(hit: ExperienceSearchResult): MapSearchMarker {
  const coords = hit.location?.coordinates;
  return {
    id: hit.id,
    title: hit.title,
    type: hit.type,
    latitude: coords?.latitude ?? 0,
    longitude: coords?.longitude ?? 0,
    heroImageUrl: hit.heroImage?.url,
    cityName: hit.location?.city,
    descriptionShort: hit.description,
  };
}

/**
 * Map search hook. Delegates to the API Service's `/v1/search/map` which
 * reuses `searchMapExperiences()` — so city grouping, filter facets and
 * all admin-config driven behaviours stay in sync with web.
 */
export function useMapSearch({
  region,
  zoom,
  filters,
  query,
}: UseMapSearchParams) {
  const {i18n} = useTranslation();
  const locale = i18n.language;
  const isCityLevel = zoom >= ZOOM_THRESHOLD;

  const searchParams = useMemo(() => {
    if (!region) return null;
    const bbox = regionToGeoBbox(region, 0.15);
    return {
      query: query || '*',
      locale,
      filters: {
        ...filters,
        geoBoundingBox: bbox,
      },
      groupByCity: !isCityLevel,
    };
  }, [region, locale, filters, query, isCityLevel]);

  return useQuery({
    queryKey: [
      ...queryKeys.map.search(),
      locale,
      searchParams ? stableFilterKey(searchParams.filters) : '',
      searchParams?.query ?? '',
      isCityLevel ? 'city' : 'country',
    ],
    queryFn: async (): Promise<MapSearchResult> => {
      if (!searchParams || !region) {
        return {markers: [], cities: [], facets: {}, found: 0, isCityLevel};
      }

      const response = await searchApi.mapSearch(searchParams);

      const markers = response.hits.map(hitToMarker);
      const cities: MapSearchCity[] =
        response.cityGroups?.map(g => ({name: g.city, count: g.count})) ?? [];

      return {
        markers,
        cities,
        facets: response.facets ?? {},
        found: response.found,
        isCityLevel,
      };
    },
    enabled: searchParams !== null,
    staleTime: CACHE_TIMES.SHORT,
    placeholderData: prev => prev,
  });
}
