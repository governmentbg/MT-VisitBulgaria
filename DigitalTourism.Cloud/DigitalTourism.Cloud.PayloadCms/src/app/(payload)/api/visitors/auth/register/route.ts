/**
 * Registration API Endpoint
 *
 * Creates a new visitor account via Keycloak Admin API and auto-logs them in.
 *
 * @route POST /api/visitors/auth/register
 * @body {{ email: string, password: string, firstName?: string, lastName?: string }}
 * @returns {{ success: true, visitor: Visitor } | { success: false, error: string, errorCode: string }}
 *
 * @security
 * - Uses service account with manage-users role
 * - Email uniqueness enforced by Keycloak
 * - Password policies enforced by Keycloak
 * - Sets HttpOnly cookie on success
 *
 * @example
 * ```ts
 * const response = await fetch('/api/visitors/auth/register', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     password: 'SecurePassword123!',
 *     firstName: 'John',
 *     lastName: 'Doe'
 *   }),
 *   headers: { 'Content-Type': 'application/json' }
 * })
 * ```
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  createKeycloakUser,
  loginWithPassword,
  findOrCreateVisitor,
  generatePayloadToken,
  VISITOR_TOKEN_COOKIE,
  COOKIE_MAX_AGE,
  type RegisterData,
} from '@/auth/keycloak-direct'

/** Request body schema for registration */
interface RegisterRequestBody {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

/**
 * Validates the registration request body
 */
function validateBody(body: unknown): body is RegisterRequestBody {
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

/**
 * Validates password strength (minimum requirements)
 * Note: Keycloak may have additional policies that will be enforced server-side
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' }
  }
  return { valid: true }
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

    const { email, password, firstName, lastName } = body

    // Validate email format
    if (!isValidEmail(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format', errorCode: 'INVALID_EMAIL' },
        { status: 400 },
      )
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return Response.json(
        { success: false, error: passwordValidation.error, errorCode: 'WEAK_PASSWORD' },
        { status: 400 },
      )
    }

    console.log('[Auth Register] Attempting registration for:', email)

    // Create user in Keycloak
    const registerData: RegisterData = {
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
    }

    const createResult = await createKeycloakUser(registerData)

    if ('error' in createResult) {
      console.log('[Auth Register] Failed to create user:', createResult.errorCode)
      return Response.json(
        { success: false, error: createResult.error, errorCode: createResult.errorCode },
        { status: createResult.errorCode === 'EMAIL_EXISTS' ? 409 : 400 },
      )
    }

    console.log('[Auth Register] Keycloak user created:', createResult.userId)

    // Auto-login the new user
    const loginResult = await loginWithPassword(registerData.email, password)

    if (!loginResult) {
      // User was created but auto-login failed - still success, user can login manually
      console.error('[Auth Register] Auto-login failed after registration')
      return Response.json(
        {
          success: true,
          visitor: null,
          message: 'Account created successfully. Please log in.',
        },
        { status: 201 },
      )
    }

    console.log('[Auth Register] Auto-login successful')

    // Get Payload instance
    const payload = await getPayload({ config: configPromise })

    // Create visitor in Payload
    const visitor = await findOrCreateVisitor(payload, {
      keycloakId: loginResult.userInfo.id,
      email: loginResult.userInfo.email,
      name:
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || loginResult.userInfo.username,
    })

    console.log('[Auth Register] Visitor created:', visitor.id, visitor.email)

    // Generate Payload token
    const token = await generatePayloadToken(visitor, payload.secret)

    // Build response with auth cookie
    return new Response(JSON.stringify({ success: true, visitor }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${VISITOR_TOKEN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
      },
    })
  } catch (error) {
    console.error('[Auth Register] Error:', error)
    return Response.json(
      { success: false, error: 'Registration service unavailable', errorCode: 'SERVICE_UNAVAILABLE' },
      { status: 503 },
    )
  }
}
