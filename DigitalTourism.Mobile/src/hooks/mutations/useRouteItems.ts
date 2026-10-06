import {useMutation, useQueryClient} from '@tanstack/react-query';
import {routesApi} from '../../services/api/routesApi';
import {queryKeys} from '../../utils/queryKeys';
import type {Route, RouteExperienceType, RouteStop} from '../../models/Route';

// --- Add stop ---

interface AddRouteStopParams {
  routeId: number;
  dayIndex: number;
  experienceType: RouteExperienceType;
  experienceId: number;
}

export function useAddRouteStop() {
  const queryClient = useQueryClient();

  return useMutation<Route, Error, AddRouteStopParams>({
    mutationFn: ({routeId, dayIndex, experienceType, experienceId}) =>
      routesApi.addStop(routeId, dayIndex, experienceType, experienceId),
    onSuccess: (data, variables) => {
      // Immediately update cache with the mutation result so UI reflects the change
      queryClient.setQueryData(queryKeys.routes.detail(variables.routeId), data);
      // Background refetch for fully populated data (depth=2, with names/images)
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.detail(variables.routeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to add stop to route:', error.message);
    },
  });
}

// --- Remove stop ---

interface RemoveRouteStopParams {
  routeId: number;
  experienceType: RouteExperienceType;
  experienceId: number;
}

export function useRemoveRouteStop() {
  const queryClient = useQueryClient();

  return useMutation<Route, Error, RemoveRouteStopParams>({
    mutationFn: ({routeId, experienceType, experienceId}) =>
      routesApi.removeStop(routeId, experienceType, experienceId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.detail(variables.routeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to remove stop from route:', error.message);
    },
  });
}

// --- Reorder stops ---

interface ReorderRouteStopsParams {
  routeId: number;
  days: Array<{dayNumber: number; stops: RouteStop[]}>;
}

export function useReorderRouteStops() {
  const queryClient = useQueryClient();

  return useMutation<Route, Error, ReorderRouteStopsParams>({
    mutationFn: ({routeId, days}) => routesApi.reorderStops(routeId, days),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.detail(variables.routeId),
      });
    },
    onError: (error) => {
      console.error('Failed to reorder route stops:', error.message);
    },
  });
}

// --- Toggle visited (server-side) ---

interface ToggleStopVisitedParams {
  routeId: number;
  stopId: string;
  visited: boolean;
}

export function useToggleStopVisited() {
  const queryClient = useQueryClient();

  return useMutation<Route, Error, ToggleStopVisitedParams>({
    mutationFn: ({routeId, stopId, visited}) =>
      routesApi.toggleStopVisited(routeId, stopId, visited),
    onSuccess: (data, variables) => {
      // Immediately update cache with the returned data for instant UI feedback
      queryClient.setQueryData(queryKeys.routes.detail(variables.routeId), data);
      // Background refetch for fully populated data
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.detail(variables.routeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to toggle stop visited:', error instanceof Error ? error.message : error);
    },
  });
}

// --- Download PDF ---

interface DownloadPdfParams {
  routeId: number;
  locale?: string;
}

export function useDownloadRoutePdf() {
  return useMutation<string, Error, DownloadPdfParams>({
    mutationFn: ({routeId, locale}) =>
      routesApi.downloadPdf(routeId, locale),
    onError: (error) => {
      console.error('Failed to download route PDF:', error.message);
    },
  });
}
