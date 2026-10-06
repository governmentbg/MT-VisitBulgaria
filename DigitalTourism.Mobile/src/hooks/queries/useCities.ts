import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {queryKeys} from '../../utils/queryKeys';
import {citiesApi} from '../../services/api/citiesApi';
import {CACHE_TIMES} from '../../constants';

/**
 * Hook to fetch all cities for map clustering
 *
 * Cities are a small, static dataset — cached with VERY_LONG stale time.
 * Automatically uses current locale from i18n context.
 */
export function useCities() {
  const {i18n} = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: queryKeys.cities.list(locale),
    queryFn: () => citiesApi.getAll(locale),
    staleTime: CACHE_TIMES.VERY_LONG,
  });
}
