import { parseCookies } from 'payload/shared'
import { type RealmType, realmConfigs, serverUrl, logger } from './types'
import { discoverOidcEndpoints } from './discovery'

/**
 * OAuth logout endpoint - clears session cookies and redirects to Keycloak end_session_endpoint
 */
export async function keycloakLogout(realm: RealmType, request: Request): Promise<Response> {
  const config = realmConfigs[realm]
  const realmLogger = logger.child({ realm })
  realmLogger.info('Starting logout flow')

  const cookies = parseCookies(request.headers)
  const idToken = cookies.get(config.idTokenCookieName)

  const endpoints = await discoverOidcEndpoints(realm)

  const postLogoutRedirectUri =
    realm === 'backoffice' ? `${serverUrl}/admin/login` : serverUrl

  const logoutParams = new URLSearchParams({
    client_id: config.clientId,
    post_logout_redirect_uri: postLogoutRedirectUri,
  })

  if (idToken) {
    logoutParams.set('id_token_hint', idToken)
  }

  const logoutUrl = `${endpoints.endSessionEndpoint}?${logoutParams.toString()}`
  realmLogger.info('Redirecting to logout', { logoutUrl })

  const responseHeaders = new Headers()
  responseHeaders.set('Location', logoutUrl)

  // Clear auth cookies
  const clearCookies = [
    config.cookieName,
    config.idTokenCookieName,
    config.pkceCookieName,
    // Next.js draft mode cookies
    '__prerender_bypass',
    '__next_preview_data',
  ]
  for (const name of clearCookies) {
    responseHeaders.append('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
  }

  return new Response(null, {
    status: 302,
    headers: responseHeaders,
  })
}
