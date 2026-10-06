/**
 * Keycloak Direct Grant Authentication Module
 *
 * Provides server-side functions for direct authentication operations:
 * - Resource Owner Password Credentials (ROPC) grant for login
 * - Service account token acquisition for admin operations
 * - User management via Keycloak Admin API
 *
 * @module auth/keycloak-direct
 */

import { SignJWT } from 'jose'
import type { Payload } from 'payload'
import type { Visitor } from '@/payload-types'

/** Token expiration in seconds (24 hours) */
const TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24

/**
 * Configuration for the frontoffice realm
 */
interface KeycloakConfig {
  issuer: string
  clientId: string
  clientSecret: string
  serviceClientId: string
  serviceClientSecret: string
}

/**
 * Result of a successful authentication
 */
export interface AuthSuccess {
  success: true
  visitor: Visitor
  token: string
}

/**
 * Result of a failed authentication
 */
export interface AuthFailure {
  success: false
  error: string
  errorCode: AuthErrorCode
}

/**
 * Error codes for authentication failures
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_DISABLED'
  | 'USER_NOT_FOUND'
  | 'EMAIL_EXISTS'
  | 'INVALID_EMAIL'
  | 'WEAK_PASSWORD'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN_ERROR'

export type AuthResult = AuthSuccess | AuthFailure

/**
 * Data required for user registration
 */
export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  language?: 'en' | 'bg' | 'de' | 'fr'
}

/**
 * Keycloak token response from token endpoint
 */
interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope?: string
}

/**
 * Keycloak user representation from Admin API
 */
interface KeycloakUser {
  id: string
  username: string
  email: string
  emailVerified: boolean
  firstName?: string
  lastName?: string
  enabled: boolean
  attributes?: Record<string, string[]>
}

// Server URL for building callback URLs
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Gets the Keycloak configuration for the frontoffice realm
 */
function getConfig(): KeycloakConfig {
  return {
    issuer: process.env.KEYCLOAK_FRONTOFFICE_ISSUER || 'http://localhost:8080/realms/frontoffice',
    clientId: process.env.KEYCLOAK_FRONTOFFICE_CLIENT_ID || 'digitaltourism-web',
    clientSecret: process.env.KEYCLOAK_FRONTOFFICE_CLIENT_SECRET || '',
    serviceClientId:
      process.env.KEYCLOAK_SERVICE_CLIENT_ID || 'digitaltourism-web-service',
    serviceClientSecret: process.env.KEYCLOAK_SERVICE_SECRET || '',
  }
}

/**
 * Extracts the base URL from the issuer URL
 * @example 'http://localhost:8080/realms/frontoffice' -> 'http://localhost:8080'
 */
function getKeycloakBaseUrl(issuer: string): string {
  const url = new URL(issuer)
  return `${url.protocol}//${url.host}`
}

/**
 * Gets the realm name from the issuer URL
 * @example 'http://localhost:8080/realms/frontoffice' -> 'frontoffice'
 */
function getRealmName(issuer: string): string {
  const match = issuer.match(/\/realms\/([^/]+)/)
  return match ? match[1] : 'frontoffice'
}

// OIDC Discovery cache
let oidcEndpointsCache: {
  tokenEndpoint: string
  userinfoEndpoint: string
} | null = null

/**
 * Discovers OIDC endpoints from the well-known configuration
 */
async function discoverOidcEndpoints() {
  if (oidcEndpointsCache) return oidcEndpointsCache

  const config = getConfig()
  const wellKnownUrl = `${config.issuer}/.well-known/openid-configuration`

  const response = await fetch(wellKnownUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch OIDC configuration: ${response.status}`)
  }

  const oidcConfig = await response.json()
  oidcEndpointsCache = {
    tokenEndpoint: oidcConfig.token_endpoint,
    userinfoEndpoint: oidcConfig.userinfo_endpoint,
  }

  return oidcEndpointsCache
}

/**
 * Acquires a service account token for admin operations.
 * Uses client credentials grant with the service account client.
 *
 * @returns The access token for admin API calls
 * @throws Error if token acquisition fails
 */
export async function getServiceAccountToken(): Promise<string> {
  const config = getConfig()
  const endpoints = await discoverOidcEndpoints()

  const response = await fetch(endpoints.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.serviceClientId,
      client_secret: config.serviceClientSecret,
    }).toString(),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('[Keycloak] Service account token failed:', response.status, errorBody)
    throw new Error('Failed to acquire service account token')
  }

  const tokens: TokenResponse = await response.json()
  return tokens.access_token
}

/**
 * Authenticates a user using Resource Owner Password Credentials (ROPC) grant.
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Token response on success, null on failure
 *
 * @security
 * - Credentials are sent server-side only
 * - Subject to Keycloak brute force protection
 */
export async function loginWithPassword(
  email: string,
  password: string,
): Promise<{ tokens: TokenResponse; userInfo: KeycloakUser } | null> {
  const config = getConfig()
  const endpoints = await discoverOidcEndpoints()

  // Request token using ROPC grant
  const tokenResponse = await fetch(endpoints.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      username: email,
      password: password,
      scope: 'openid profile email',
    }).toString(),
  })

  if (!tokenResponse.ok) {
    console.error('[Keycloak] ROPC login failed:', tokenResponse.status)
    return null
  }

  const tokens: TokenResponse = await tokenResponse.json()

  // Fetch user info
  const userinfoResponse = await fetch(endpoints.userinfoEndpoint, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })

  if (!userinfoResponse.ok) {
    console.error('[Keycloak] User info request failed')
    return null
  }

  const userInfo = await userinfoResponse.json()

  return {
    tokens,
    userInfo: {
      id: userInfo.sub,
      username: userInfo.preferred_username || userInfo.email,
      email: userInfo.email,
      emailVerified: userInfo.email_verified || false,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      enabled: true,
    },
  }
}

/**
 * Creates a new user in Keycloak via the Admin API.
 *
 * @param data - User registration data
 * @returns The created user's ID on success, or an error
 *
 * @security
 * - Uses service account with manage-users role
 * - Email uniqueness enforced by Keycloak
 */
export async function createKeycloakUser(
  data: RegisterData,
): Promise<{ userId: string } | { error: string; errorCode: AuthErrorCode }> {
  const config = getConfig()
  const baseUrl = getKeycloakBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)

  try {
    const serviceToken = await getServiceAccountToken()

    const userData = {
      username: data.email,
      email: data.email,
      emailVerified: false,
      enabled: true,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      credentials: [
        {
          type: 'password',
          value: data.password,
          temporary: false,
        },
      ],
      attributes: {
        locale: [data.language || 'en'],
      },
      realmRoles: ['user'],
    }

    const response = await fetch(`${baseUrl}/admin/realms/${realm}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (response.status === 201) {
      // Extract user ID from Location header
      const location = response.headers.get('Location')
      const userId = location?.split('/').pop()
      if (!userId) {
        return { error: 'Failed to get created user ID', errorCode: 'UNKNOWN_ERROR' }
      }
      return { userId }
    }

    if (response.status === 409) {
      return { error: 'A user with this email already exists', errorCode: 'EMAIL_EXISTS' }
    }

    const errorBody = await response.text()
    console.error('[Keycloak] Create user failed:', response.status, errorBody)

    // Parse Keycloak error message
    try {
      const errorJson = JSON.parse(errorBody)
      if (errorJson.errorMessage?.includes('password')) {
        return { error: 'Password does not meet requirements', errorCode: 'WEAK_PASSWORD' }
      }
    } catch {
      // Ignore JSON parse error
    }

    return { error: 'Failed to create user', errorCode: 'UNKNOWN_ERROR' }
  } catch (error) {
    console.error('[Keycloak] Create user error:', error)
    return { error: 'Service unavailable', errorCode: 'SERVICE_UNAVAILABLE' }
  }
}

/**
 * Finds a Keycloak user by email address.
 *
 * @param email - Email address to search for
 * @returns User if found, null otherwise
 */
export async function findUserByEmail(email: string): Promise<KeycloakUser | null> {
  const config = getConfig()
  const baseUrl = getKeycloakBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)

  try {
    const serviceToken = await getServiceAccountToken()

    const response = await fetch(
      `${baseUrl}/admin/realms/${realm}/users?email=${encodeURIComponent(email)}&exact=true`,
      {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      },
    )

    if (!response.ok) {
      console.error('[Keycloak] Find user failed:', response.status)
      return null
    }

    const users: KeycloakUser[] = await response.json()
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error('[Keycloak] Find user error:', error)
    return null
  }
}

/**
 * Sends a password reset email to a user.
 *
 * @param userId - Keycloak user ID
 * @returns true on success, false on failure
 */
export async function sendPasswordResetEmail(userId: string): Promise<boolean> {
  const config = getConfig()
  const baseUrl = getKeycloakBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)

  try {
    const serviceToken = await getServiceAccountToken()

    const response = await fetch(
      `${baseUrl}/admin/realms/${realm}/users/${userId}/execute-actions-email`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['UPDATE_PASSWORD']),
      },
    )

    if (!response.ok) {
      console.error('[Keycloak] Send password reset failed:', response.status)
      return false
    }

    return true
  } catch (error) {
    console.error('[Keycloak] Send password reset error:', error)
    return false
  }
}

/**
 * Builds the authorization URL for social login with IdP hint.
 *
 * @param provider - Social provider alias (google, facebook, apple)
 * @param state - CSRF state token
 * @param codeChallenge - PKCE code challenge
 * @returns Authorization URL
 */
export function getSocialAuthUrl(
  provider: 'google' | 'facebook' | 'apple',
  state: string,
  codeChallenge: string,
): string {
  const config = getConfig()

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: `${serverUrl}/api/visitors/oauth/keycloak/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    kc_idp_hint: provider,
  })

  return `${config.issuer}/protocol/openid-connect/auth?${params.toString()}`
}

/**
 * Generates a Payload JWT token for a visitor.
 *
 * @param visitor - Visitor object
 * @param payloadSecret - Payload secret for signing
 * @returns Signed JWT token
 */
export async function generatePayloadToken(
  visitor: Visitor,
  payloadSecret: string,
): Promise<string> {
  const secretKey = new TextEncoder().encode(payloadSecret)
  const issuedAt = Math.floor(Date.now() / 1000)
  const exp = issuedAt + TOKEN_EXPIRATION_SECONDS

  return await new SignJWT({
    id: visitor.id,
    email: visitor.email,
    collection: 'visitors',
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(exp)
    .sign(secretKey)
}

/**
 * Finds or creates a visitor in Payload based on Keycloak user info.
 *
 * @param payload - Payload instance
 * @param keycloakUser - User info from Keycloak
 * @returns Visitor object
 */
export async function findOrCreateVisitor(
  payload: Payload,
  keycloakUser: {
    keycloakId: string
    email: string
    name?: string
    language?: string
  },
): Promise<Visitor> {
  // Try to find by Keycloak ID
  const existingByKeycloakId = await payload.find({
    collection: 'visitors',
    where: { keycloakId: { equals: keycloakUser.keycloakId } },
    limit: 1,
  })

  if (existingByKeycloakId.docs.length > 0) {
    return existingByKeycloakId.docs[0]
  }

  // Try to find by email
  const existingByEmail = await payload.find({
    collection: 'visitors',
    where: { email: { equals: keycloakUser.email } },
    limit: 1,
  })

  if (existingByEmail.docs.length > 0) {
    // Link existing visitor to Keycloak ID
    const existing = existingByEmail.docs[0]
    await payload.update({
      collection: 'visitors',
      id: existing.id,
      data: {
        keycloakId: keycloakUser.keycloakId,
        ...(keycloakUser.language
          ? { language: keycloakUser.language as 'en' | 'bg' | 'de' | 'fr' }
          : {}),
      },
    })
    return existing
  }

  // Create new visitor
  return await payload.create({
    collection: 'visitors',
    data: {
      email: keycloakUser.email,
      name: keycloakUser.name || '',
      keycloakId: keycloakUser.keycloakId,
      language: (keycloakUser.language as 'en' | 'bg' | 'de' | 'fr') || 'en',
    },
  })
}

/** Cookie name for visitor authentication token */
export const VISITOR_TOKEN_COOKIE = 'payload-visitor-token'

/** Cookie max age in seconds (24 hours) */
export const COOKIE_MAX_AGE = TOKEN_EXPIRATION_SECONDS
