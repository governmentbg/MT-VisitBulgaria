import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {AppState, type AppStateStatus} from 'react-native';
import {authorize, refresh, revoke} from 'react-native-app-auth';
import base64 from 'react-native-base64';
import {AUTH_CONFIG, AUTH_STORAGE_KEYS, KEYCLOAK_ACCOUNT_URL, KC_ACTION_UPDATE_PASSWORD} from '../constants/auth';
import {
  setTokenAccessor,
  setTokenRefresher,
  setOnAuthFailure,
} from '../services/api/apiClient';
import {deleteAccount as deleteAccountApi} from '../services/api/accountApi';
import {profileApi} from '../services/api/profileApi';
import {getEncryptedAuthStorage} from '../utils/encryptedStorage';
import {queryClient} from '../services/queryClient';

/**
 * Decoded user info from ID token JWT payload
 */
interface UserInfo {
  sub: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

/**
 * Auth Context State
 */
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
}

/**
 * Profile update data
 */
export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
}

/**
 * Auth Context Actions
 */
interface AuthActions {
  login: () => Promise<boolean>;
  logoutUser: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  changePassword: () => Promise<boolean>;
  deleteAccount: () => Promise<void>;
  sessionExpired: boolean;
  clearSessionExpired: () => void;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decode JWT payload for display purposes only (name, email, avatar).
 *
 * SECURITY NOTE: Signature validation is intentionally omitted because:
 * 1. This token arrives via react-native-app-auth PKCE flow over TLS (trusted channel)
 * 2. It is used ONLY for UI display — not for authentication or authorization decisions
 * 3. The access token (used for API calls) is validated server-side by the backend
 * 4. Adding client-side JWKS validation (jose library) would add significant complexity
 *    (key fetching, caching, offline handling) for zero practical security benefit
 */
function decodeJwtPayload(token: string): UserInfo | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    // Base64url -> Base64
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4) {
      payload += '=';
    }
    // react-native-base64 returns a binary (Latin-1) string, which corrupts
    // multi-byte UTF-8 characters (e.g. Cyrillic names). Re-interpret the
    // raw bytes as UTF-8 before parsing.
    const binary = base64.decode(payload);
    const json = decodeURIComponent(
      Array.prototype.map
        .call(binary, (c: string) =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
        )
        .join(''),
    );
    const decoded = JSON.parse(json);
    return {
      sub: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      preferred_username: decoded.preferred_username,
      given_name: decoded.given_name,
      family_name: decoded.family_name,
      picture: decoded.picture,
    };
  } catch {
    return null;
  }
}

/**
 * If the JWT doesn't contain a picture claim (common with social logins where
 * Keycloak's token mapper isn't configured), try fetching it from the OIDC
 * userinfo endpoint which often includes it.
 */
async function enrichUserPicture(
  user: UserInfo,
  accessToken: string,
): Promise<UserInfo> {
  if (user.picture) {
    return user;
  }
  try {
    const info = await profileApi.getKeycloakUserInfo(accessToken);
    if (info.picture) {
      return {...user, picture: info.picture};
    }
  } catch {
    // Non-critical — fall back to no avatar
  }
  return user;
}

/**
 * Store tokens in encrypted MMKV
 */
async function persistTokens(
  accessToken: string,
  refreshToken: string | undefined,
  idToken: string | undefined,
  accessTokenExpirationDate: string,
) {
  const storage = await getEncryptedAuthStorage();
  storage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    storage.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
  if (idToken) {
    storage.set(AUTH_STORAGE_KEYS.ID_TOKEN, idToken);
  }
  storage.set(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, accessTokenExpirationDate);
}

/**
 * Clear all stored tokens
 */
async function clearTokens() {
  const storage = await getEncryptedAuthStorage();
  storage.remove(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  storage.remove(AUTH_STORAGE_KEYS.ID_TOKEN);
  storage.remove(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });
  const [sessionExpired, setSessionExpired] = useState(false);
  const clearSessionExpired = useCallback(() => setSessionExpired(false), []);

  const refreshTokenRef = useRef<string | null>(null);
  const idTokenRef = useRef<string | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const expiryRef = useRef<string | null>(null);
  const isLoggingOutRef = useRef(false);

  /**
   * Attempt to refresh the access token
   */
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const storedRefresh = refreshTokenRef.current;
    if (!storedRefresh || isLoggingOutRef.current) {
      return null;
    }

    try {
      const result = await refresh(AUTH_CONFIG, {refreshToken: storedRefresh});
      accessTokenRef.current = result.accessToken;
      refreshTokenRef.current = result.refreshToken ?? storedRefresh;
      idTokenRef.current = result.idToken ?? idTokenRef.current;
      expiryRef.current = result.accessTokenExpirationDate;

      await persistTokens(
        result.accessToken,
        result.refreshToken ?? storedRefresh,
        result.idToken ?? idTokenRef.current ?? undefined,
        result.accessTokenExpirationDate,
      );

      const newUser = result.idToken ? decodeJwtPayload(result.idToken) : null;
      setState(prev => ({...prev, user: newUser ?? prev.user}));

      if (newUser && !newUser.picture) {
        enrichUserPicture(newUser, result.accessToken).then(enriched => {
          if (enriched !== newUser) {
            setState(prev => ({...prev, user: enriched}));
          }
        });
      }

      return result.accessToken;
    } catch (error) {
      console.error('[Auth] Token refresh failed:', error);
      await clearTokens();
      accessTokenRef.current = null;
      refreshTokenRef.current = null;
      idTokenRef.current = null;
      expiryRef.current = null;
      setState({isAuthenticated: false, isLoading: false, user: null});
      setSessionExpired(true);
      return null;
    }
  }, []);

  /**
   * Get a valid access token, refreshing if needed (60s buffer)
   */
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const token = accessTokenRef.current;
    const expiry = expiryRef.current;

    if (!token) {
      return null;
    }

    if (expiry) {
      const expiryTime = new Date(expiry).getTime();
      const now = Date.now();
      const bufferMs = 60 * 1000;

      if (expiryTime - now < bufferMs) {
        return refreshAccessToken();
      }
    }

    return token;
  }, [refreshAccessToken]);

  /**
   * Restore tokens from MMKV on mount
   */
  useEffect(() => {
    const restoreTokens = async () => {
      try {
        const storage = await getEncryptedAuthStorage();
        const storedAccess = storage.getString(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        const storedRefresh = storage.getString(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        const storedId = storage.getString(AUTH_STORAGE_KEYS.ID_TOKEN);
        const storedExpiry = storage.getString(AUTH_STORAGE_KEYS.ACCESS_TOKEN_EXPIRY);

        if (storedAccess && storedRefresh) {
          accessTokenRef.current = storedAccess;
          refreshTokenRef.current = storedRefresh;
          idTokenRef.current = storedId ?? null;
          expiryRef.current = storedExpiry ?? null;

          // Check if token is expired and try to refresh
          if (storedExpiry) {
            const expiryTime = new Date(storedExpiry).getTime();
            if (expiryTime < Date.now()) {
              const newToken = await refreshAccessToken();
              if (!newToken) {
                setState({isAuthenticated: false, isLoading: false, user: null});
                return;
              }
            }
          }

          let user = storedId ? decodeJwtPayload(storedId) : null;
          setState({isAuthenticated: true, isLoading: false, user});

          if (user && storedAccess) {
            enrichUserPicture(user, storedAccess).then(enriched => {
              if (enriched !== user) {
                setState(prev => ({...prev, user: enriched}));
              }
            });
          }
        } else {
          setState({isAuthenticated: false, isLoading: false, user: null});
        }
      } catch (error) {
        console.error('[Auth] Failed to restore tokens:', error);
        setState({isAuthenticated: false, isLoading: false, user: null});
      }
    };

    restoreTokens();
  }, [refreshAccessToken]);

  /**
   * Refresh token when app resumes from background (handles stale sessions)
   */
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active' && accessTokenRef.current && expiryRef.current) {
        const expiryTime = new Date(expiryRef.current).getTime();
        if (expiryTime - Date.now() < 60 * 1000) {
          refreshAccessToken();
        }
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [refreshAccessToken]);

  /**
   * Force logout — clears tokens and resets state without server revocation.
   * Used by the 401 interceptor when refresh fails.
   */
  const forceLogout = useCallback(async () => {
    await clearTokens();
    queryClient.clear();
    accessTokenRef.current = null;
    refreshTokenRef.current = null;
    idTokenRef.current = null;
    expiryRef.current = null;
    setState({isAuthenticated: false, isLoading: false, user: null});
  }, []);

  /**
   * Register token accessor, refresher, and auth failure handler with apiClient
   */
  useEffect(() => {
    setTokenAccessor(getAccessToken);
    setTokenRefresher(refreshAccessToken);
    setOnAuthFailure(() => {
      forceLogout();
    });
  }, [getAccessToken, refreshAccessToken, forceLogout]);


  /**
   * Login via Keycloak
   */
  const login = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({...prev, isLoading: true}));
      const result = await authorize(AUTH_CONFIG);

      accessTokenRef.current = result.accessToken;
      refreshTokenRef.current = result.refreshToken ?? null;
      idTokenRef.current = result.idToken ?? null;
      expiryRef.current = result.accessTokenExpirationDate;

      await persistTokens(
        result.accessToken,
        result.refreshToken,
        result.idToken,
        result.accessTokenExpirationDate,
      );

      let user = result.idToken ? decodeJwtPayload(result.idToken) : null;
      setState({isAuthenticated: true, isLoading: false, user});
      setSessionExpired(false);

      if (user) {
        enrichUserPicture(user, result.accessToken).then(enriched => {
          if (enriched !== user) {
            setState(prev => ({...prev, user: enriched}));
          }
        });
      }

      return true;
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('User cancelled flow')) {
        // User cancelled - no action needed
      } else {
        console.error('[Auth] Login failed:', error instanceof Error ? error.message : error);
      }
      setState(prev => ({...prev, isLoading: false}));
      return false;
    }
  }, []);

  /**
   * Update user profile via Keycloak Account REST API
   */
  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(KEYCLOAK_ACCOUNT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Profile update failed: ${response.status}`);
      }

      // Refresh token to get updated claims
      const newToken = await refreshAccessToken();
      if (newToken && idTokenRef.current) {
        const updatedUser = decodeJwtPayload(idTokenRef.current);
        if (updatedUser) {
          setState(prev => ({...prev, user: updatedUser}));
        }
      }
    },
    [getAccessToken, refreshAccessToken],
  );

  /**
   * Trigger Keycloak's "update password" application-initiated action.
   *
   * Runs a fresh PKCE authorize flow with `kc_action=UPDATE_PASSWORD`, so
   * the user sees Keycloak's native change-password form inside the same
   * in-app browser session (ASWebAuthenticationSession / Custom Tabs) and
   * is redirected back to the app on success. This replaces linking to the
   * Keycloak Account Console, which fails with 401/"Something went wrong"
   * because the system browser has no SSO session with Keycloak.
   *
   * On success the returned tokens are persisted just like a normal login,
   * so the user remains authenticated with refreshed claims.
   */
  const changePassword = useCallback(async (): Promise<boolean> => {
    try {
      const result = await authorize({
        ...AUTH_CONFIG,
        additionalParameters: {
          ...(AUTH_CONFIG.additionalParameters ?? {}),
          kc_action: KC_ACTION_UPDATE_PASSWORD,
        },
      });

      accessTokenRef.current = result.accessToken;
      refreshTokenRef.current = result.refreshToken ?? refreshTokenRef.current;
      idTokenRef.current = result.idToken ?? idTokenRef.current;
      expiryRef.current = result.accessTokenExpirationDate;

      await persistTokens(
        result.accessToken,
        result.refreshToken ?? refreshTokenRef.current ?? undefined,
        result.idToken ?? idTokenRef.current ?? undefined,
        result.accessTokenExpirationDate,
      );

      const user = result.idToken ? decodeJwtPayload(result.idToken) : null;
      setState(prev => ({
        isAuthenticated: true,
        isLoading: false,
        user: user ?? prev.user,
      }));
      return true;
    } catch (error: unknown) {
      // Any failure here (including the user closing the in-app browser,
      // swiping the sheet away, or native cancellation codes that differ
      // per platform) is treated as a silent cancel. Keycloak surfaces
      // real change-password errors inside its own UI before redirecting,
      // so there is nothing actionable for us to show as a toast/alert.
      if (__DEV__) {
        console.debug(
          '[Auth] Change password flow ended without success:',
          error instanceof Error ? error.message : error,
        );
      }
      return false;
    }
  }, []);

  /**
   * Logout: revoke tokens server-side and clear local state.
   * Uses token revocation instead of browser-based logout to avoid
   * the "User cancelled flow" error on Android.
   */
  const logoutUser = useCallback(async () => {
    isLoggingOutRef.current = true;
    setState(prev => ({...prev, isLoading: true}));
    try {
      const token = refreshTokenRef.current ?? accessTokenRef.current;
      if (token) {
        await revoke(AUTH_CONFIG, {
          tokenToRevoke: token,
          includeBasicAuth: false,
          sendClientId: true,
        });
      }
    } catch (error) {
      console.warn('[Auth] Token revocation failed (continuing cleanup):', error);
    } finally {
      await clearTokens();
      queryClient.clear();
      accessTokenRef.current = null;
      refreshTokenRef.current = null;
      idTokenRef.current = null;
      expiryRef.current = null;
      setState({isAuthenticated: false, isLoading: false, user: null});
      isLoggingOutRef.current = false;
    }
  }, []);

  /**
   * Permanently anonymize the current account.
   *
   * Calls the backend `DELETE /v1/account`, which rewrites the Keycloak
   * user's PII, disables the account, and kills all active sessions. On
   * success we tear down local auth state — the tokens are already dead
   * server-side, so any failure inside `logoutUser` (e.g. token revocation)
   * is treated as best-effort cleanup.
   */
  const deleteAccount = useCallback(async () => {
    await deleteAccountApi();
    try {
      await logoutUser();
    } catch (error) {
      if (__DEV__) {
        console.debug('[Auth] Post-deletion logout cleanup failed:', error);
      }
    }
  }, [logoutUser]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logoutUser,
    getAccessToken,
    updateProfile,
    changePassword,
    deleteAccount,
    sessionExpired,
    clearSessionExpired,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
