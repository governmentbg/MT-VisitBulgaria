import { jwtVerify } from 'jose'
import { parseCookies } from 'payload/shared'
import type { AuthStrategy, AuthStrategyFunctionArgs } from 'payload'
import { type RealmType, realmConfigs, logger } from './types'

/**
 * Factory function to create a Keycloak auth strategy for a specific realm
 */
export function createKeycloakStrategy(realm: RealmType): AuthStrategy {
  const config = realmConfigs[realm]

  return {
    name: `keycloak-${realm}`,
    authenticate: async (args: AuthStrategyFunctionArgs) => {
      const { headers, payload } = args
      const realmLogger = logger.child({ realm })

      if (!headers) {
        realmLogger.debug('No headers in request')
        return { user: null }
      }

      const cookies = parseCookies(headers)
      const token = cookies.get(config.cookieName)

      if (!token) {
        return { user: null }
      }

      try {
        const secretKey = new TextEncoder().encode(payload.secret)
        const { payload: claims } = await jwtVerify(token, secretKey)

        // Validate token belongs to this realm's collection
        if (!claims.id || !claims.collection || claims.collection !== config.collection) {
          realmLogger.debug('Token collection mismatch', {
            expected: config.collection,
            got: String(claims.collection),
          })
          return { user: null }
        }

        // Fetch from the appropriate collection based on realm
        if (realm === 'backoffice') {
          const user = await payload.findByID({
            collection: 'users',
            id: claims.id as number,
          })

          if (!user) {
            realmLogger.error('User not found for token')
            return { user: null }
          }


          return { user: { ...user, collection: 'users' as const } }
        } else {
          const visitor = await payload.findByID({
            collection: 'visitors',
            id: claims.id as number,
          })

          if (!visitor) {
            realmLogger.error('Visitor not found for token')
            return { user: null }
          }

          return { user: { ...visitor, collection: 'visitors' as const } }
        }
      } catch (error) {
        realmLogger.error('Token verification failed', { error: String(error) })
        return { user: null }
      }
    },
  }
}

// Export pre-configured strategies for each collection
export const keycloakStrategy = createKeycloakStrategy('backoffice')
export const visitorKeycloakStrategy = createKeycloakStrategy('frontoffice')
