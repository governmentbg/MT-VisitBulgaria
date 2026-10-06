import { logger, getConfig } from './config'

let tokenCache: { token: string; expiresAt: number } | null = null

/**
 * Acquires a service account token for the backoffice realm using client_credentials grant.
 * Cached with TTL to avoid unnecessary token requests.
 */
export async function getBackofficeServiceToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.token
  }

  const config = getConfig()
  const tokenEndpoint = `${config.issuer}/protocol/openid-connect/token`

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.serviceClientId,
      client_secret: config.serviceClientSecret,
    }).toString(),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    logger.error('Failed to acquire backoffice service token', {
      status: response.status,
      error: errorBody,
    })
    throw new Error('Failed to acquire backoffice service account token')
  }

  const tokens = await response.json()
  tokenCache = {
    token: tokens.access_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  }

  return tokens.access_token
}
