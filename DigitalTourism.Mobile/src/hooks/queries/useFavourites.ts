import {useQuery} from '@tanstack/react-query';
import {queryKeys} from '../../utils/queryKeys';
import {favouritesApi} from '../../services/api';
import {CACHE_TIMES} from '../../constants';

/**
 * Hook to fetch the current user's favourites.
 *
 * Returns a flat list of FavouriteItem objects ready for UI consumption.
 * Only runs when the user is authenticated (pass `enabled`).
 */
export function useFavourites(enabled = true) {
  return useQuery({
    queryKey: queryKeys.favourites.list(),
    queryFn: () => favouritesApi.getAll(),
    staleTime: CACHE_TIMES.SHORT,
    enabled,
  });
}
