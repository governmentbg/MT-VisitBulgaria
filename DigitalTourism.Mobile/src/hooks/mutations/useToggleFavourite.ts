import {useMutation, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '../../utils/queryKeys';
import {favouritesApi} from '../../services/api';
import type {FavouriteExperienceType, FavouriteItem} from '../../models/Favourite';

/**
 * Mutation to remove a favourite by its document ID.
 * Uses optimistic update for instant UI feedback.
 */
export function useRemoveFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favouriteId: number) => favouritesApi.remove(favouriteId),
    onMutate: async (favouriteId: number) => {
      await queryClient.cancelQueries({queryKey: queryKeys.favourites.all});
      const previous = queryClient.getQueryData<FavouriteItem[]>(
        queryKeys.favourites.list(),
      );
      queryClient.setQueryData<FavouriteItem[]>(
        queryKeys.favourites.list(),
        old => old?.filter(f => f.favouriteId !== favouriteId) ?? [],
      );
      return {previous};
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.favourites.list(),
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.favourites.all});
    },
  });
}

/**
 * Mutation to add a favourite.
 * Invalidates both favourites and entity detail caches on success.
 */
export function useAddFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      relationTo,
      experienceId,
    }: {
      relationTo: FavouriteExperienceType;
      experienceId: number;
    }) => favouritesApi.add(relationTo, experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.favourites.all});
    },
  });
}
