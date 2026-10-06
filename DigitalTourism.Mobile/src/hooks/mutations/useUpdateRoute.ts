import {useMutation, useQueryClient} from '@tanstack/react-query';
import {routesApi} from '../../services/api/routesApi';
import {queryKeys} from '../../utils/queryKeys';
import type {Route} from '../../models/Route';

interface PayloadStopPayload {
  experience: {relationTo: string; value: number};
  note?: string | null;
  visited?: boolean;
}

interface PayloadDayPayload {
  dayNumber: number;
  stops: PayloadStopPayload[];
}

interface UpdateRouteParams {
  id: number;
  updates: {
    name?: string;
    startDate?: string;
    duration?: number;
    days?: PayloadDayPayload[];
    pool?: Array<{experience: {relationTo: string; value: number}}>;
  };
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();

  return useMutation<Route, Error, UpdateRouteParams>({
    mutationFn: ({id, updates}) => routesApi.update(id, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.detail(variables.id),
      });
    },
    onError: (error) => {
      console.error('Failed to update route:', error.message);
    },
  });
}
