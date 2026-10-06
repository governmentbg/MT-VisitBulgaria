import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {API_CONFIG} from './config';

let currentLanguage = 'en';
let tokenAccessor: (() => Promise<string | null>) | null = null;
let tokenRefresher: (() => Promise<string | null>) | null = null;
let onAuthFailure: (() => void) | null = null;

export function setTokenAccessor(accessor: () => Promise<string | null>) {
  tokenAccessor = accessor;
}

/** Get the current auth token (for use outside apiClient, e.g. RNFS downloads) */
export async function getAuthToken(): Promise<string | null> {
  if (!tokenAccessor) return null;
  try {
    return await tokenAccessor();
  } catch {
    return null;
  }
}

/**
 * Register a function that forces a token refresh (bypasses expiry buffer check).
 * Called by AuthProvider on mount.
 */
export function setTokenRefresher(refresher: () => Promise<string | null>) {
  tokenRefresher = refresher;
}

/**
 * Register a callback invoked when token refresh fails on a 401.
 * Typically used to trigger logout / clear auth state.
 */
export function setOnAuthFailure(callback: () => void) {
  onAuthFailure = callback;
}

export function setApiLanguage(lng: string) {
  currentLanguage = lng;
}

/**
 * Axios client configured for Payload CMS API
 * 
 * Note: Query parameters like `depth` and `locale` are handled by individual
 * API service methods (attractionsApi, eventsApi) rather than being applied
 * globally through interceptors. This provides flexibility for different
 * endpoints to use different parameter values.
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Accept-Language header
apiClient.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = currentLanguage;
  return config;
});

// Interceptor to add Authorization Bearer header
apiClient.interceptors.request.use(async (config) => {
  if (tokenAccessor) {
    try {
      const token = await tokenAccessor();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[apiClient] Token retrieval failed:', error instanceof Error ? error.message : error);
    }
  }
  return config;
});

// Block insecure HTTP in production builds
if (!__DEV__) {
  apiClient.interceptors.request.use(config => {
    const url = config.baseURL || config.url || '';
    if (url.startsWith('http://')) {
      return Promise.reject(new Error('Insecure HTTP blocked in production'));
    }
    return config;
  });
}

// Sliding-window rate limiter: max 30 requests per 10-second window.
// Each request timestamp is tracked individually and expires after 10s.
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 10_000;
const _timestamps: number[] = [];

apiClient.interceptors.request.use(config => {
  const now = Date.now();
  while (_timestamps.length > 0 && now - _timestamps[0] > RATE_WINDOW_MS) {
    _timestamps.shift();
  }
  if (_timestamps.length >= RATE_LIMIT) {
    return Promise.reject(new Error('Client rate limit exceeded'));
  }
  _timestamps.push(now);
  return config;
});

// 401 Response Interceptor — force-refresh token and retry once
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

function processPendingRequests(token: string | null, error?: unknown) {
  pendingRequests.forEach(({resolve, reject}) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingRequests = [];
}

apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  // Only handle 401s for requests that had auth and haven't been retried.
  // If the original request carried no Authorization header, the caller was
  // a guest — don't trigger the reauth cycle (which would clear the query
  // cache via onAuthFailure) for endpoints the guest shouldn't be hitting.
  const hadAuthHeader = !!originalRequest?.headers?.Authorization;
  if (
    error.response?.status !== 401 ||
    !originalRequest ||
    originalRequest._retry ||
    !tokenRefresher ||
    !hadAuthHeader
  ) {
    return Promise.reject(error);
  }

  // If we're already refreshing, queue this request (with 15s timeout)
  if (isRefreshing) {
    return new Promise<string | null>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Token refresh timeout'));
      }, 15000);
      pendingRequests.push({
        resolve: (token) => { clearTimeout(timeout); resolve(token); },
        reject: (err) => { clearTimeout(timeout); reject(err); },
      });
    }).then(token => {
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        originalRequest._retry = true;
        return apiClient(originalRequest);
      }
      return Promise.reject(error);
    });
  }

  isRefreshing = true;
  originalRequest._retry = true;

  try {
    const newToken = await tokenRefresher();

    if (newToken) {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      processPendingRequests(newToken);
      return apiClient(originalRequest);
    }

    // Refresh returned null — session is gone
    processPendingRequests(null);
    onAuthFailure?.();
    return Promise.reject(error);
  } catch (refreshError) {
    processPendingRequests(null, refreshError);
    onAuthFailure?.();
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
});
