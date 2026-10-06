/**
 * Entity Query Hooks Factory
 *
 * Creates standardized useAll/useOne React Query hooks for entity types.
 * Also provides usePaginated (infinite scroll) and useWithPagination (single page)
 * factories to eliminate duplicated pagination boilerplate.
 */

import {useQuery, useInfiniteQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {CACHE_TIMES} from '../../constants';
import type {PaginationMeta} from '../../services/api/transforms';

interface EntityHooksConfig<T> {
  /** Query key namespace from queryKeys (e.g. queryKeys.hotels) */
  queryKeyNamespace: {
    list: (filters?: Record<string, unknown>) => readonly unknown[];
    detail: (id: string, locale?: string) => readonly unknown[];
  };
  /** API service methods */
  api: {
    getAll: (
      locale: string,
      limit: number,
      page: number,
      ...args: unknown[]
    ) => Promise<{items: T[]; pagination: PaginationMeta}>;
    getById: (id: string, locale: string) => Promise<T | null>;
  };
  /** Cache stale time (default: CACHE_TIMES.LONG) */
  staleTime?: number;
}

export function createEntityHooks<T>(config: EntityHooksConfig<T>) {
  const {queryKeyNamespace, api, staleTime = CACHE_TIMES.LONG} = config;



  function useAll() {
    const {i18n} = useTranslation();
    const locale = i18n.language;

    return useQuery({
      queryKey: queryKeyNamespace.list({locale}),
      queryFn: async () => {
        const response = await api.getAll(locale, 10000, 1);
        return response.items;
      },
      staleTime,
    });
  }

  function useOne(id: string | undefined) {
    const {i18n} = useTranslation();
    const locale = i18n.language;

    return useQuery({
      queryKey: queryKeyNamespace.detail(id!, locale),
      queryFn: () => api.getById(id!, locale),
      enabled: !!id,
      staleTime,
    });
  }

  function useWithPagination(
    limit: number = 20,
    page: number = 1,
    filters?: Record<string, unknown>,
  ) {
    const {i18n} = useTranslation();
    const locale = i18n.language;

    return useQuery({
      queryKey: queryKeyNamespace.list({locale, limit, page, ...filters}),
      queryFn: () => api.getAll(locale, limit, page, filters?.status),
      staleTime,
    });
  }

  function usePaginated(limit: number = 20, filters?: Record<string, unknown>) {
    const {i18n} = useTranslation();
    const locale = i18n.language;

    return useInfiniteQuery({
      queryKey: queryKeyNamespace.list({locale, limit, ...filters}),
      queryFn: ({pageParam = 1}) =>
        api.getAll(locale, limit, pageParam, filters?.status),
      getNextPageParam: lastPage => {
        const {pagination} = lastPage;
        return pagination.hasNextPage ? pagination.page + 1 : undefined;
      },
      initialPageParam: 1,
      staleTime,
      select: data => ({
        pages: data.pages,
        pageParams: data.pageParams,
        items: data.pages.flatMap(page => page.items),
        pagination: data.pages[data.pages.length - 1]?.pagination,
      }),
    });
  }

  return {useAll, useOne, useWithPagination, usePaginated};
}
