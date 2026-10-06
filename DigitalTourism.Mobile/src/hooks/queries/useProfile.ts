import {useQuery} from '@tanstack/react-query';
import {profileApi} from '../../services/api';
import {useAuth} from '../../contexts/AuthContext';

/**
 * Hook to fetch the authenticated user's profile from the API Service (via Gateway).
 */
export function useProfile() {
  const {isAuthenticated} = useAuth();

  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profileApi.getMe(),
    enabled: isAuthenticated,
  });
}

/**
 * Hook to fetch user info directly from Keycloak's OIDC userinfo endpoint.
 */
export function useKeycloakUserInfo() {
  const {isAuthenticated, getAccessToken} = useAuth();

  return useQuery({
    queryKey: ['profile', 'keycloak'],
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('No access token');
      }
      return profileApi.getKeycloakUserInfo(token);
    },
    enabled: isAuthenticated,
  });
}

/**
 * Hook to verify Payload CMS connectivity via the API Gateway → API Service.
 */
export function usePayloadPing() {
  const {isAuthenticated} = useAuth();

  return useQuery({
    queryKey: ['profile', 'payload'],
    queryFn: () => profileApi.getPayloadStatus(),
    enabled: isAuthenticated,
  });
}
