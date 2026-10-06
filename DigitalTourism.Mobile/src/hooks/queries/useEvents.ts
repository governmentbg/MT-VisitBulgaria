import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {queryKeys} from '../../utils/queryKeys';
import {eventsApi} from '../../services/api';
import {CACHE_TIMES} from '../../constants';
import {createEntityHooks} from './createEntityHooks';
import type {Event} from '../../models/Event';

const {useOne, useWithPagination, usePaginated} =
  createEntityHooks<Event>({
    queryKeyNamespace: queryKeys.events,
    api: eventsApi,
    staleTime: CACHE_TIMES.MEDIUM,
  });

export const useEvent = useOne;
export const useEventsWithPagination = useWithPagination;
export const usePaginatedEvents = usePaginated;

// Unique: active events with auto-refresh
export function useActiveEvents() {
  const {i18n} = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: queryKeys.events.active(locale),
    queryFn: () => eventsApi.getActive(locale),
    staleTime: CACHE_TIMES.MEDIUM,
    refetchInterval: CACHE_TIMES.MEDIUM,
  });
}

// Unique: flat list with status filter
export function useEventsList(filters?: {status?: string}) {
  const {i18n} = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: queryKeys.events.list({locale, ...filters}),
    queryFn: async () => {
      const response = await eventsApi.getAll(locale, 20, 1);
      return response.items;
    },
    staleTime: CACHE_TIMES.MEDIUM,
  });
}
