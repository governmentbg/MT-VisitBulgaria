/**
 * Login API Endpoint
 *
 * Authenticates a visitor using email and password via Keycloak Direct Grant (ROPC).
 *
 * @route POST /api/visitors/auth/login
 * @body {{ email: string, password: string }}
 * @returns {{ success: true, visitor: Visitor } | { success: false, error: string, errorCode: string }}
 *
 * @security
 * - Credentials are sent to Keycloak via server-side ROPC grant
 * - Rate limited by Keycloak brute force protection (5 attempts, 15min lockout)
 * - Sets HttpOnly cookie on success
 *
 * @example
 * ```ts
 * const response = await fetch('/api/visitors/auth/login', {
 *   method: 'POST',
 *   body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
 *   headers: { 'Content-Type': 'application/json' }
 * })
 * ```
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  loginWithPassword,
  findOrCreateVisitor,
  generatePayloadToken,
  VISITOR_TOKEN_COOKIE,
  COOKIE_MAX_AGE,
} from '@/auth/keycloak-direct'

/** Request body schema for login */
interface LoginRequestBody {
  email: string
  password: string
}

/**
 * Validates the login request body
 */
function validateBody(body: unknown): body is LoginRequestBody {
  if (!body || typeof body !== 'object') return false
  const { email, password } = body as Record<string, unknown>
  return typeof email === 'string' && typeof password === 'string'
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json(
        { success: false, error: 'Invalid request body', errorCode: 'INVALID_REQUEST' },
        { status: 400 },
      )
    }

    // Validate body
    if (!validateBody(body)) {
      return Response.json(
        { success: false, error: 'Email and password are required', errorCode: 'INVALID_REQUEST' },
        { status: 400 },
      )
    }

    const { email, password } = body

    // Validate email format
    if (!isValidEmail(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format', errorCode: 'INVALID_EMAIL' },
        { status: 400 },
      )
    }

    // Validate password not empty
    if (!password.trim()) {
      return Response.json(
        { success: false, error: 'Password is required', errorCode: 'INVALID_REQUEST' },
        { status: 400 },
      )
    }

    console.log('[Auth Login] Attempting login for:', email)

    // Authenticate with Keycloak
    const keycloakResult = await loginWithPassword(email.toLowerCase().trim(), password)

    if (!keycloakResult) {
      console.log('[Auth Login] Invalid credentials for:', email)
      return Response.json(
        {
          success: false,
          error: 'Invalid email or password',
          errorCode: 'INVALID_CREDENTIALS',
        },
        { status: 401 },
      )
    }

    console.log('[Auth Login] Keycloak authentication successful for:', email)

    // Get Payload instance
    const payload = await getPayload({ config: configPromise })

    // Find or create visitor in Payload
    const visitor = await findOrCreateVisitor(payload, {
      keycloakId: keycloakResult.userInfo.id,
      email: keycloakResult.userInfo.email,
      name:
        keycloakResult.userInfo.firstName && keycloakResult.userInfo.lastName
          ? `${keycloakResult.userInfo.firstName} ${keycloakResult.userInfo.lastName}`
          : keycloakResult.userInfo.firstName || keycloakResult.userInfo.username,
    })

    console.log('[Auth Login] Visitor found/created:', visitor.id, visitor.email)

    // Generate Payload token
    const token = await generatePayloadToken(visitor, payload.secret)

    return new Response(JSON.stringify({ success: true, visitor }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${VISITOR_TOKEN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
      },
    })
  } catch (error) {
    console.error('[Auth Login] Error:', error)
    return Response.json(
      { success: false, error: 'Authentication service unavailable', errorCode: 'SERVICE_UNAVAILABLE' },
      { status: 503 },
    )
  }
}
