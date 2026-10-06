import { type RealmType, realmConfigs, logger } from './types'
import { discoverOidcEndpoints } from './discovery'
import { generatePKCE, generateRandomString, createPkceCookie, PKCE_COOKIE_MAX_AGE } from './pkce'

/**
 * OAuth authorize endpoint - redirects to Keycloak login for the specified realm
 */
export async function keycloakAuthorize(realm: RealmType, loginHint?: string, redirectAfterLogin?: string, locale?: string): Promise<Response> {
  const config = realmConfigs[realm]
  const realmLogger = logger.child({ realm })
  realmLogger.info('Starting authorization flow')
  realmLogger.info('Callback URL', { callbackUrl: config.callbackUrl })

  const endpoints = await discoverOidcEndpoints(realm)
  const pkce = await generatePKCE()
  const state = generateRandomString(32)

  const pkceCookie = await createPkceCookie(state, pkce.codeVerifier, realm, redirectAfterLogin)

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.callbackUrl,
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: pkce.codeChallenge,
    code_challenge_method: 'S256',
  })

  if (loginHint) {
    params.set('login_hint', loginHint)
  }

  if (locale) {
    params.set('ui_locales', locale)
  }

  const authUrl = `${endpoints.authorizationEndpoint}?${params.toString()}`
  realmLogger.info('Redirecting to', { authUrl })

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
      'Set-Cookie': `${config.pkceCookieName}=${pkceCookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${PKCE_COOKIE_MAX_AGE}`,
    },
  })
}
