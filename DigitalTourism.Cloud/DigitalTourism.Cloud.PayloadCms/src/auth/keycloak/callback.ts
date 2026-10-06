import { SignJWT } from 'jose'
import { parseCookies } from 'payload/shared'
import type { Payload } from 'payload'
import type { User, Visitor } from '@/payload-types'
import { type RealmType, realmConfigs, logger, TOKEN_EXPIRATION_SECONDS, serverUrl } from './types'
import { discoverOidcEndpoints } from './discovery'
import { verifyPkceCookie } from './pkce'
import { extractRolesFromToken, hasAllowedRole } from './roles'
import { findOrCreateUser } from './findOrCreateUser'

/**
 * OAuth callback endpoint - exchanges code for tokens for the specified realm
 */
export async function keycloakCallback(
  realm: RealmType,
  request: Request,
  payload: Payload,
): Promise<Response> {
  const config = realmConfigs[realm]
  const realmLogger = logger.child({ realm })
  realmLogger.info('Processing callback')

  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  if (error) {
    const errorDescription = url.searchParams.get('error_description') || error
    realmLogger.error('OAuth error', { error, errorDescription })
    return new Response(`Authentication failed: ${errorDescription}`, { status: 400 })
  }

  if (!code || !state) {
    realmLogger.error('Missing code or state')
    return new Response('Missing authorization code or state', { status: 400 })
  }

  const cookies = parseCookies(request.headers)
  const pkceCookie = cookies.get(config.pkceCookieName)

  if (!pkceCookie) {
    realmLogger.error('Missing PKCE cookie')
    return new Response('Invalid or expired state. Please try logging in again.', { status: 400 })
  }

  const pkceData = await verifyPkceCookie(pkceCookie, state, realm)
  if (!pkceData) {
    realmLogger.error('Invalid or expired PKCE cookie')
    return new Response('Invalid or expired state. Please try logging in again.', { status: 400 })
  }

  try {
    const endpoints = await discoverOidcEndpoints(realm)

    realmLogger.info('Exchanging code for tokens')
    const tokenResponse = await fetch(endpoints.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.callbackUrl,
        code_verifier: pkceData.codeVerifier,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text()
      realmLogger.error('Token exchange failed', { status: tokenResponse.status, errorBody })
      return new Response('Token exchange failed. Please try again.', { status: 401 })
    }

    const tokens = await tokenResponse.json()
    realmLogger.info('Token exchange successful')

    const keycloakRoles = extractRolesFromToken(tokens.access_token)
    realmLogger.info('User roles', { roles: keycloakRoles })

    // Check role restrictions if configured
    if (!hasAllowedRole(keycloakRoles, config.allowedRoles)) {
      realmLogger.warn('User lacks required roles', { roles: keycloakRoles })
      const requiredRoles = config.allowedRoles?.join(' or ') || 'valid'
      return new Response(`Access denied. You need ${requiredRoles} role to access this area.`, {
        status: 403,
      })
    }

    // Fetch user info
    const userinfoResponse = await fetch(endpoints.userinfoEndpoint, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userinfoResponse.ok) {
      realmLogger.error('Userinfo request failed')
      return new Response('Failed to get user information', { status: 401 })
    }

    const userInfo = await userinfoResponse.json()
    realmLogger.info('User info', { email: userInfo.email })

    // Find or create user/visitor in the appropriate collection
    const user = await findOrCreateUser(payload, realm, {
      keycloakId: userInfo.sub,
      email: userInfo.email,
      firstName: userInfo.given_name || '',
      lastName: userInfo.family_name || '',
      name: userInfo.name || userInfo.preferred_username || '',
      roles: keycloakRoles,
      language: userInfo.locale,
    })

    realmLogger.info('User found/created', { id: user.id, email: (user as User | Visitor).email })

    // Generate Payload JWT token
    const secretKey = new TextEncoder().encode(payload.secret)
    const issuedAt = Math.floor(Date.now() / 1000)
    const exp = issuedAt + TOKEN_EXPIRATION_SECONDS

    const payloadToken = await new SignJWT({
      id: user.id,
      email: (user as User | Visitor).email,
      collection: config.collection,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(issuedAt)
      .setExpirationTime(exp)
      .sign(secretKey)

    realmLogger.info('Generated token for', { email: (user as User | Visitor).email })

    // For popup flows, return HTML that closes the popup
    if (pkceData.isPopup) {
      console.log(`[Keycloak ${realm}] Popup flow - returning close script`)
      const popupHtml = `<!DOCTYPE html>
<html>
<head><title>Login Complete</title></head>
<body>
<script>
  window.close();
  // Fallback redirect if close fails (e.g., popup opened manually)
  setTimeout(function() {
    if (!window.closed) window.location.href = '${config.redirectUrl}';
  }, 1000);
</script>
<p>Authentication successful. This window should close automatically.</p>
</body>
</html>`

      return new Response(popupHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Set-Cookie': `${config.cookieName}=${payloadToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_EXPIRATION_SECONDS}`,
        },
      })
    }

    // Redirect with session cookie (standard flow)
    // Use the stored redirect URL from the login flow if available, otherwise fall back to config
    // Only allow relative paths to prevent open redirect attacks
    const safeRedirect = pkceData.redirectAfterLogin?.startsWith('/') ? pkceData.redirectAfterLogin : undefined
    const redirectUrl = new URL(safeRedirect || config.redirectUrl, serverUrl).href
    realmLogger.info('Redirecting to', { redirectUrl })

    const responseHeaders = new Headers()
    responseHeaders.set('Location', redirectUrl)
    responseHeaders.append(
      'Set-Cookie',
      `${config.cookieName}=${payloadToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_EXPIRATION_SECONDS}`,
    )
    if (tokens.id_token) {
      responseHeaders.append(
        'Set-Cookie',
        `${config.idTokenCookieName}=${tokens.id_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_EXPIRATION_SECONDS}`,
      )
    }

    return new Response(null, {
      status: 302,
      headers: responseHeaders,
    })
  } catch (error) {
    realmLogger.error('Error', { error: String(error) })
    return new Response('Authentication failed. Please try again.', { status: 401 })
  }
}
