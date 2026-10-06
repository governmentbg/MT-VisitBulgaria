import { SignJWT, jwtVerify } from 'jose'
import { type RealmType, logger } from './types'

// Generate random string for state/PKCE
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }
  return result
}

// Generate PKCE code verifier and challenge
export async function generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
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

export const PKCE_COOKIE_MAX_AGE = 10 * 60 // 10 minutes

// Create a signed JWT to store PKCE data in a cookie
export async function createPkceCookie(
  state: string,
  codeVerifier: string,
  realm: RealmType,
  redirectAfterLogin?: string,
): Promise<string> {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) {
    throw new Error('PAYLOAD_SECRET not configured')
  }

  const secretKey = new TextEncoder().encode(secret)
  const claims: Record<string, unknown> = { state, codeVerifier, realm }
  if (redirectAfterLogin) {
    claims.redirectAfterLogin = redirectAfterLogin
  }
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${PKCE_COOKIE_MAX_AGE}s`)
    .sign(secretKey)

  return token
}

// Verify and extract PKCE data from cookie
export async function verifyPkceCookie(
  cookie: string,
  expectedState: string,
  expectedRealm: RealmType,
): Promise<{ codeVerifier: string; isPopup?: boolean; redirectAfterLogin?: string } | null> {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) {
    return null
  }

  try {
    const secretKey = new TextEncoder().encode(secret)
    const { payload: claims } = await jwtVerify(cookie, secretKey)
    const realmLogger = logger.child({ realm: expectedRealm })

    if (claims.state !== expectedState) {
      realmLogger.error('State mismatch in PKCE cookie')
      return null
    }

    if (claims.realm !== expectedRealm) {
      realmLogger.error('Realm mismatch in PKCE cookie')
      return null
    }

    return {
      codeVerifier: claims.codeVerifier as string,
      isPopup: claims.isPopup as boolean | undefined,
      redirectAfterLogin: claims.redirectAfterLogin as string | undefined,
    }
  } catch (error) {
    const realmLogger = logger.child({ realm: expectedRealm })
    realmLogger.error('Failed to verify PKCE cookie', { error: String(error) })
    return null
  }
}
