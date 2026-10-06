import {useQuery} from '@tanstack/react-query';
import {getFacetConfig} from '../../services/api/settingsApi';
import {CACHE_TIMES} from '../../constants';
import type {FacetConfigItem} from '../../services/api/types/searchTypes';

/**
 * Fetches the admin-configured facet definitions from the API Service.
 * Used by the filter UI to decide which facets to render, in what order,
 * with what default expansion, max visible, and selection mode.
 *
 * Cached with `VERY_LONG` stale time — facet config changes rarely and
 * the API Service also caches the upstream Payload call. `PERSISTENT`
 * `gcTime` keeps the cache warm even when the filter modal is closed,
 * so reopening never triggers a network round-trip.
 */
export function useFacetConfig() {
  return useQuery<FacetConfigItem[]>({
    queryKey: ['facet-config'],
    queryFn: getFacetConfig,
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.PERSISTENT,
  });
}
