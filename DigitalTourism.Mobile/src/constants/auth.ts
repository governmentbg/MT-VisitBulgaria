import type {AuthConfiguration} from 'react-native-app-auth';
import Config from 'react-native-config';

const KEYCLOAK_BASE_URL = Config.KEYCLOAK_BASE_URL || 'http://localhost:8080';
const REALM = 'frontoffice';
const CLIENT_ID = 'digitaltourism-mobile';
const REDIRECT_URL = `${Config.DEEP_LINK_SCHEME || 'visitbulgaria'}://callback`;

const ISSUER = `${KEYCLOAK_BASE_URL}/realms/${REALM}`;

export const AUTH_CONFIG: AuthConfiguration = {
  issuer: ISSUER,
  clientId: CLIENT_ID,
  redirectUrl: REDIRECT_URL,
  scopes: ['openid', 'profile', 'email'],
  // Controlled by ALLOW_INSECURE_HTTP env var (.env.dev=true, .env.staging/.env.production=false).
  // Defence-in-depth: also gated on __DEV__ so production builds never allow insecure HTTP.
  dangerouslyAllowInsecureHttpRequests: Config.ALLOW_INSECURE_HTTP === 'true' && __DEV__,
  serviceConfiguration: {
    authorizationEndpoint: `${ISSUER}/protocol/openid-connect/auth`,
    tokenEndpoint: `${ISSUER}/protocol/openid-connect/token`,
    revocationEndpoint: `${ISSUER}/protocol/openid-connect/revoke`,
    endSessionEndpoint: `${ISSUER}/protocol/openid-connect/logout`,
  },
};

export const KEYCLOAK_ACCOUNT_URL = `${KEYCLOAK_BASE_URL}/realms/${REALM}/account`;

/**
 * Keycloak application-initiated action identifier for triggering the
 * "update password" required-action flow via the standard OIDC authorize
 * endpoint (`kc_action=UPDATE_PASSWORD`). Using this instead of linking to
 * the Account Console lets us reuse the app's PKCE session and avoids the
 * 401/"Something went wrong" page that appears when the system browser has
 * no Keycloak session.
 */
export const KC_ACTION_UPDATE_PASSWORD = 'UPDATE_PASSWORD';

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',
  ID_TOKEN: 'auth.idToken',
  ACCESS_TOKEN_EXPIRY: 'auth.accessTokenExpiry',
} as const;
