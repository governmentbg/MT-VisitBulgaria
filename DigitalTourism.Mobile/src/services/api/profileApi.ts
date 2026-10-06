import axios from 'axios';
import Config from 'react-native-config';
import {apiClient} from './apiClient';

const KEYCLOAK_BASE_URL = Config.KEYCLOAK_BASE_URL || 'http://localhost:8080';

const keycloakClient = axios.create({
  baseURL: KEYCLOAK_BASE_URL,
  timeout: 10000,
});

if (!__DEV__) {
  keycloakClient.interceptors.request.use(config => {
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    if (url.startsWith('http://')) {
      return Promise.reject(new Error('Insecure HTTP blocked in production'));
    }
    return config;
  });
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  language: string;
}

export interface KeycloakUserInfo {
  sub: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  email_verified?: boolean;
  picture?: string;
}

export interface PayloadStatus {
  connected: boolean;
  categoryCount: number;
  error?: string;
}

export const profileApi = {
  /**
   * API Service: GET /v1/me via the API Gateway (PublicApiAuthenticated)
   * Verifies: Mobile → API Gateway (JWT validation) → API Service
   */
  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/v1/me');
    return response.data;
  },

  /**
   * Keycloak: GET /userinfo via the OIDC endpoint directly
   * Verifies: Mobile → Keycloak (token introspection)
   */
  async getKeycloakUserInfo(accessToken: string): Promise<KeycloakUserInfo> {
    const response = await keycloakClient.get<KeycloakUserInfo>(
      '/realms/frontoffice/protocol/openid-connect/userinfo',
      {headers: {Authorization: `Bearer ${accessToken}`}},
    );
    return response.data;
  },

  /**
   * Payload CMS: GET /v1/me/payload-status via the API Gateway
   * Verifies: Mobile → API Gateway (JWT) → API Service → Payload CMS
   */
  async getPayloadStatus(): Promise<PayloadStatus> {
    const response = await apiClient.get<PayloadStatus>('/v1/me/payload-status');
    return response.data;
  },
};
