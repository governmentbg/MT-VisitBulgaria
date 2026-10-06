import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {queryKeys} from '../../utils/queryKeys';
import {attractionsApi} from '../../services/api';
import {createEntityHooks} from './createEntityHooks';
import type {Attraction} from '../../models/Attraction';

const {useAll, useOne, useWithPagination, usePaginated} =
  createEntityHooks<Attraction>({
    queryKeyNamespace: queryKeys.attractions,
    api: attractionsApi,
  });

export const useAttractions = useAll;
export const useAttraction = useOne;
export const useAttractionsWithPagination = useWithPagination;
export const usePaginatedAttractions = usePaginated;

// Unique: category-based filtering (not shared by other entities)
export function useAttractionsByCategory(categoryId: string | undefined) {
  const {i18n} = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: queryKeys.attractions.list({categoryId, locale}),
    queryFn: () => attractionsApi.getByCategory(categoryId!, locale),
    enabled: !!categoryId,
  });
}
