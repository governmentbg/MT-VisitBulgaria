import {useMutation, useQueryClient} from '@tanstack/react-query';
import {routesApi} from '../../services/api/routesApi';
import {queryKeys} from '../../utils/queryKeys';
import type {Route} from '../../models/Route';

interface CreateRouteParams {
  name: string;
  startDate: string;
  duration: number;
}

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation<Route, Error, CreateRouteParams>({
    mutationFn: (params) => routesApi.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to create route:', error.message);
    },
  });
}
