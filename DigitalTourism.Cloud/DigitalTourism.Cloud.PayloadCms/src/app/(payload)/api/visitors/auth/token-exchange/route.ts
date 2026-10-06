/**
 * Token Exchange API Endpoint
 *
 * Exchanges a Keycloak access token for a Payload CMS visitor token.
 * Used by the API Gateway to convert mobile Bearer JWTs into Payload visitor cookies.
 *
 * @route POST /api/visitors/auth/token-exchange
 * @body {{ keycloakToken: string }}
 * @returns {{ success: true, token: string, visitor: { id, email } }}
 *
 * @security
 * - Validates the Keycloak token via the userinfo endpoint
 * - Uses findOrCreateVisitor (Local API) to bypass collection access control
 * - Returns a signed Payload visitor token
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  findOrCreateVisitor,
  generatePayloadToken,
} from '@/auth/keycloak-direct'

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request body
    let body: { keycloakToken?: string }
    try {
      body = await request.json()
    } catch {
      return Response.json(
        { success: false, error: 'Invalid request body', errorCode: 'INVALID_REQUEST' },
        { status: 400 },
      )
    }

    const { keycloakToken } = body
    if (!keycloakToken) {
      return Response.json(
        { success: false, error: 'keycloakToken is required', errorCode: 'INVALID_REQUEST' },
        { status: 400 },
      )
    }

    // Validate the Keycloak token via userinfo endpoint
    const issuer = process.env.KEYCLOAK_FRONTOFFICE_ISSUER
    if (!issuer) {
      console.error('[Token Exchange] KEYCLOAK_FRONTOFFICE_ISSUER not configured')
      return Response.json(
        { success: false, error: 'Auth service not configured', errorCode: 'SERVICE_UNAVAILABLE' },
        { status: 503 },
      )
    }

    const userinfoUrl = `${issuer}/protocol/openid-connect/userinfo`
    const userinfoResponse = await fetch(userinfoUrl, {
      headers: { Authorization: `Bearer ${keycloakToken}` },
    })

    if (!userinfoResponse.ok) {
      console.log('[Token Exchange] Invalid Keycloak token:', userinfoResponse.status)
      return Response.json(
        { success: false, error: 'Invalid or expired token', errorCode: 'INVALID_TOKEN' },
        { status: 401 },
      )
    }

    const userInfo = await userinfoResponse.json()
    const keycloakId = userInfo.sub
    const email = userInfo.email
    const name = userInfo.name || userInfo.preferred_username || ''
    const locale = userInfo.locale

    if (!keycloakId || !email) {
      return Response.json(
        { success: false, error: 'Token missing required claims', errorCode: 'INVALID_TOKEN' },
        { status: 401 },
      )
    }

    // Get Payload instance and find/create visitor via Local API
    const payload = await getPayload({ config: configPromise })

    const visitor = await findOrCreateVisitor(payload, {
      keycloakId,
      email,
      name,
      language: locale,
    })

    // Generate Payload visitor token
    const token = await generatePayloadToken(visitor, payload.secret)

    return Response.json({
      success: true,
      token,
      visitor: { id: visitor.id, email: visitor.email },
    })
  } catch (error) {
    console.error('[Token Exchange] Error:', error)
    return Response.json(
      { success: false, error: 'Token exchange failed', errorCode: 'SERVICE_UNAVAILABLE' },
      { status: 503 },
    )
  }
}
