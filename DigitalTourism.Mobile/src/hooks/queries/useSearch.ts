import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {searchApi} from '../../services/api/searchApi';
import {CACHE_TIMES} from '../../constants';
import type {SearchParams, SearchFilters} from '../../services/api/types/searchTypes';

/**
 * Produces a stable JSON key for filter objects by recursively sorting keys
 * and array values at every nesting level. Prevents cache misses when
 * property insertion order differs (e.g. geoBoundingBox, geoRadius).
 */
export function stableFilterKey(filters?: SearchFilters): string {
  if (!filters) return '';
  return JSON.stringify(filters, (_, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).sort().reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = value[key];
        return acc;
      }, {});
    }
    if (Array.isArray(value)) return [...value].sort();
    return value;
  });
}

/**
 * Hook for structured experience search. Delegates to the API Service,
 * which runs the same `searchExperiences()` logic as the web frontend.
 */
export function useSearch(params: SearchParams = {}) {
  const {i18n} = useTranslation();
  const locale = params.locale || i18n.language;

  return useQuery({
    queryKey: [
      'search',
      params.query ?? '*',
      locale,
      stableFilterKey(params.filters),
      params.page ?? 1,
      params.perPage ?? 20,
      params.sortBy ?? '',
      params.geoSort ? `${params.geoSort.lat},${params.geoSort.lng}` : '',
    ],
    queryFn: () => searchApi.search({...params, locale}),
    staleTime: CACHE_TIMES.SHORT,
    enabled: params.query !== undefined || params.filters !== undefined,
  });
}

/**
 * Hook to get facet counts (for filter UIs). Requests perPage=0 so the
 * server returns only the `facets` map without any hits.
 */
export function useSearchFacets(filters?: SearchFilters) {
  const {i18n} = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['search-facets', locale, stableFilterKey(filters)],
    queryFn: () => searchApi.facets(locale, filters),
    staleTime: CACHE_TIMES.MEDIUM,
  });
}

/**
 * Hook for search autocomplete suggestions, optionally sorted by
 * proximity to a point.
 */
export function useSearchSuggest(
  query: string,
  geoSort?: {lat: number; lng: number} | null,
) {
  const {i18n} = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['search-suggest', query, locale, geoSort?.lat ?? '', geoSort?.lng ?? ''],
    queryFn: () => searchApi.suggest(query, locale, 5, geoSort ?? undefined),
    enabled: query.length >= 2,
    staleTime: CACHE_TIMES.SHORT,
  });
}
