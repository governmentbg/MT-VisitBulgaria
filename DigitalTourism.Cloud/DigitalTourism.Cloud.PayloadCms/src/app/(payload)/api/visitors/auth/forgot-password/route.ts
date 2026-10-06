/**
 * Forgot Password API Endpoint
 *
 * Initiates a password reset flow by sending a reset email via Keycloak.
 *
 * @route POST /api/visitors/auth/forgot-password
 * @body {{ email: string }}
 * @returns {{ success: true }} (always, to prevent email enumeration)
 *
 * @security
 * - Always returns success to prevent email enumeration attacks
 * - Uses service account with manage-users role
 * - Rate limited by Keycloak brute force protection
 *
 * @example
 * ```ts
 * const response = await fetch('/api/visitors/auth/forgot-password', {
 *   method: 'POST',
 *   body: JSON.stringify({ email: 'user@example.com' }),
 *   headers: { 'Content-Type': 'application/json' }
 * })
 * ```
 */

import { findUserByEmail, sendPasswordResetEmail } from '@/auth/keycloak-direct'

/** Request body schema for forgot password */
interface ForgotPasswordRequestBody {
  email: string
}

/**
 * Validates the forgot password request body
 */
function validateBody(body: unknown): body is ForgotPasswordRequestBody {
  if (!body || typeof body !== 'object') return false
  const { email } = body as Record<string, unknown>
  return typeof email === 'string'
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
        { success: false, error: 'Email is required', errorCode: 'INVALID_REQUEST' },
        { status: 400 },
      )
    }

    const { email } = body

    // Validate email format
    if (!isValidEmail(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format', errorCode: 'INVALID_EMAIL' },
        { status: 400 },
      )
    }

    console.log('[Auth ForgotPassword] Password reset requested for:', email)

    // Find user in Keycloak (do this server-side only, don't expose result)
    const user = await findUserByEmail(email.toLowerCase().trim())

    if (user) {
      // Send password reset email
      const sent = await sendPasswordResetEmail(user.id)
      if (sent) {
        console.log('[Auth ForgotPassword] Reset email sent for:', email)
      } else {
        console.error('[Auth ForgotPassword] Failed to send reset email for:', email)
      }
    } else {
      // User not found - log but don't expose to client
      console.log('[Auth ForgotPassword] User not found:', email)
    }

    // Always return success to prevent email enumeration
    return Response.json({ success: true })
  } catch (error) {
    console.error('[Auth ForgotPassword] Error:', error)
    // Still return success to prevent information leakage
    return Response.json({ success: true })
  }
}
