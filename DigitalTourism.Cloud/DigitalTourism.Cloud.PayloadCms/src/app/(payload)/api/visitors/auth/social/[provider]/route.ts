/**
 * Social Login API Endpoint
 *
 * Initiates OAuth flow with a social identity provider via Keycloak.
 *
 * @route GET /api/visitors/auth/social/{provider}
 * @param provider - Social provider: 'google', 'facebook', or 'apple'
 * @query popup - Set to 'true' for popup-based flow
 * @returns Redirect to Keycloak with kc_idp_hint for the specified provider
 *
 * @security
 * - Uses PKCE for all OAuth flows
 * - State parameter prevents CSRF
 * - Callback handled by existing OAuth callback endpoint
 *
 * @example
 * ```ts
 * // In popup window
 * window.location.href = '/api/visitors/auth/social/google?popup=true'
 * ```
 */

import { SignJWT } from 'jose'
import { getSocialAuthUrl } from '@/auth/keycloak-direct'

/** Valid social provider types */
type SocialProvider = 'google' | 'facebook' | 'apple'

/** PKCE cookie configuration */
const PKCE_COOKIE_NAME = 'keycloak-pkce-frontoffice'
const PKCE_COOKIE_MAX_AGE = 10 * 60 // 10 minutes

/**
 * Validates that the provider is a supported social provider
 */
function isValidProvider(provider: string): provider is SocialProvider {
  return ['google', 'facebook', 'apple'].includes(provider)
}

/**
 * Generates a random string for state/PKCE
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }
  return result
}

/**
 * Generates PKCE code verifier and challenge
 */
async function generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const codeVerifier = generateRandomString(64)

  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = new Uint8Array(hashBuffer)
  const codeChallenge = btoa(String.fromCharCode(...hashArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return { codeVerifier, codeChallenge }
}

/**
 * Creates a signed JWT to store PKCE data in a cookie
 */
async function createPkceCookie(
  state: string,
  codeVerifier: string,
  isPopup: boolean,
): Promise<string> {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) {
    throw new Error('PAYLOAD_SECRET not configured')
  }

  const secretKey = new TextEncoder().encode(secret)
  const token = await new SignJWT({ state, codeVerifier, realm: 'frontoffice', isPopup })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${PKCE_COOKIE_MAX_AGE}s`)
    .sign(secretKey)

  return token
}

interface RouteParams {
  params: Promise<{ provider: string }>
}

export async function GET(request: Request, { params }: RouteParams): Promise<Response> {
  const { provider } = await params

  // Validate provider
  if (!isValidProvider(provider)) {
    return Response.json(
      {
        success: false,
        error: `Invalid provider: ${provider}. Supported providers: google, facebook, apple`,
        errorCode: 'INVALID_PROVIDER',
      },
      { status: 400 },
    )
  }

  console.log(`[Auth Social] Starting ${provider} login flow`)

  try {
    // Check if this is a popup flow
    const url = new URL(request.url)
    const isPopup = url.searchParams.get('popup') === 'true'

    // Generate PKCE
    const pkce = await generatePKCE()
    const state = generateRandomString(32)

    // Create PKCE cookie
    const pkceCookie = await createPkceCookie(state, pkce.codeVerifier, isPopup)

    // Build authorization URL with IdP hint
    const authUrl = getSocialAuthUrl(provider, state, pkce.codeChallenge)

    console.log(`[Auth Social] Redirecting to ${provider}:`, authUrl)

    // Set response headers
    const headers: HeadersInit = {
      Location: authUrl,
      'Set-Cookie': `${PKCE_COOKIE_NAME}=${pkceCookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${PKCE_COOKIE_MAX_AGE}`,
    }

    // For popup flows, add header to indicate popup mode
    if (isPopup) {
      headers['X-Auth-Popup'] = 'true'
    }

    return new Response(null, {
      status: 302,
      headers,
    })
  } catch (error) {
    console.error(`[Auth Social] Error starting ${provider} flow:`, error)
    return Response.json(
      { success: false, error: 'Failed to initiate social login', errorCode: 'SERVICE_UNAVAILABLE' },
      { status: 503 },
    )
  }
}
