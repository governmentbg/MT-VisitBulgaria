import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {routesApi} from '../../services/api/routesApi';
import {queryKeys} from '../../utils/queryKeys';
import {useAuth} from '../../contexts/AuthContext';
import type {Route} from '../../models/Route';

/**
 * Fetch all routes for the current authenticated user.
 */
export function useRoutes() {
  const {i18n} = useTranslation();
  const {isAuthenticated} = useAuth();
  const locale = i18n.language;

  return useQuery<Route[]>({
    queryKey: queryKeys.routes.lists(),
    queryFn: () => routesApi.getAll(locale),
    enabled: isAuthenticated,
  });
}

/**
 * Fetch a single route by ID with fully populated stops.
 */
export function useRoute(id: number) {
  const {i18n} = useTranslation();
  const {isAuthenticated} = useAuth();
  const locale = i18n.language;

  return useQuery<Route | null>({
    queryKey: queryKeys.routes.detail(id),
    queryFn: () => routesApi.getById(id, locale),
    enabled: !!id && isAuthenticated,
  });
}
