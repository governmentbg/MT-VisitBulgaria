import {useInfiniteQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {searchApi} from '../../services/api/searchApi';
import type {SearchParams} from '../../services/api/types/searchTypes';
import {stableFilterKey} from './useSearch';
import {CACHE_TIMES} from '../../constants';

/**
 * Infinite scroll hook for Typesense search.
 */
export function useInfiniteSearch(params: SearchParams = {}) {
  const {i18n} = useTranslation();
  const locale = params.locale || i18n.language;
  const perPage = params.perPage || 20;
  const filterKey = stableFilterKey(params.filters);
  const enabled = params.query !== undefined || params.filters !== undefined;

  return useInfiniteQuery({
    queryKey: ['infinite-search', params.query ?? '*', locale, filterKey, perPage, params.sortBy ?? ''],
    queryFn: ({pageParam}) =>
      searchApi.search({...params, locale, page: pageParam, perPage}),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.found / perPage);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled,
    staleTime: CACHE_TIMES.SHORT,
  });
}
