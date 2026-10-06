import { type RealmType, realmConfigs, logger } from './types'

// OIDC Discovery cache per realm
const oidcEndpointsCache: Record<
  RealmType,
  {
    authorizationEndpoint: string
    tokenEndpoint: string
    userinfoEndpoint: string
    endSessionEndpoint: string
  } | null
> = {
  backoffice: null,
  frontoffice: null,
}

export async function discoverOidcEndpoints(realm: RealmType) {
  if (oidcEndpointsCache[realm]) return oidcEndpointsCache[realm]!

  const config = realmConfigs[realm]
  const wellKnownUrl = `${config.issuer}/.well-known/openid-configuration`

  const response = await fetch(wellKnownUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch OIDC configuration for ${realm}: ${response.status}`)
  }

  try {
    const oidcConfig = await response.json()
    oidcEndpointsCache[realm] = {
      authorizationEndpoint: oidcConfig.authorization_endpoint,
      tokenEndpoint: oidcConfig.token_endpoint,
      userinfoEndpoint: oidcConfig.userinfo_endpoint,
      endSessionEndpoint: oidcConfig.end_session_endpoint,
    }
    const realmLogger = logger.child({ realm })
    realmLogger.info('Discovered OIDC endpoints', {
      authorizationEndpoint: oidcEndpointsCache[realm]!.authorizationEndpoint,
    })
  } catch (error) {
    throw new Error(`Failed to parse OIDC configuration for ${realm}: ${error}`)
  }

  return oidcEndpointsCache[realm]!
}
