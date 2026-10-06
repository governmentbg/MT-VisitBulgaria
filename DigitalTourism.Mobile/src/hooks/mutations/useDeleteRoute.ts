import {useMutation, useQueryClient} from '@tanstack/react-query';
import {routesApi} from '../../services/api/routesApi';
import {queryKeys} from '../../utils/queryKeys';

export function useDeleteRoute() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => routesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to delete route:', error.message);
    },
  });
}
