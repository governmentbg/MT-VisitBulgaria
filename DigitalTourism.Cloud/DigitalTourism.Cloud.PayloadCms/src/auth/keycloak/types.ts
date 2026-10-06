import type { User } from '@/payload-types'
import { createLogger } from '@/plugins/logging'

export const logger = createLogger('auth:keycloak')

//TODO: handle token renewal/refresh
//TODO: cleanup code here

// Token expiration in seconds (24 hours)
export const TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24

// Derived from the Users collection roles field — stays in sync with generate:types
export type UserRole = NonNullable<User['roles']>[number]

export const ALLOWED_ROLES: UserRole[] = [
  'admin',
  'business-owner',
  'municipal-moderator',
  'tourism-curator',
]

// Realm types
export type RealmType = 'backoffice' | 'frontoffice'

// Configuration interface for each realm
export interface RealmConfig {
  issuer: string
  clientId: string
  clientSecret: string
  callbackUrl: string
  redirectUrl: string
  collection: 'users' | 'visitors'
  cookieName: string
  pkceCookieName: string
  idTokenCookieName: string
  allowedRoles?: UserRole[]
}

// Get server URL for building callback URLs
export const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Realm configurations
export const realmConfigs: Record<RealmType, RealmConfig> = {
  backoffice: {
    issuer:
      process.env.KEYCLOAK_BACKOFFICE_ISSUER ||
      process.env.KEYCLOAK_ISSUER ||
      'http://localhost:8080/realms/digitaltourism',
    clientId:
      process.env.KEYCLOAK_BACKOFFICE_CLIENT_ID ||
      process.env.KEYCLOAK_CLIENT_ID ||
      'digitaltourism-cms',
    clientSecret:
      process.env.KEYCLOAK_BACKOFFICE_CLIENT_SECRET || process.env.KEYCLOAK_CLIENT_SECRET || '',
    callbackUrl:
      process.env.KEYCLOAK_BACKOFFICE_CALLBACK_URL ||
      process.env.KEYCLOAK_CALLBACK_URL ||
      `${serverUrl}/api/users/oauth/keycloak/callback`,
    redirectUrl: `${serverUrl}/admin`,
    collection: 'users',
    cookieName: 'payload-token',
    pkceCookieName: 'keycloak-pkce-backoffice',
    idTokenCookieName: 'keycloak-id-token-backoffice',
    allowedRoles: ['admin', 'business-owner', 'municipal-moderator', 'tourism-curator'],
  },
  frontoffice: {
    issuer: process.env.KEYCLOAK_FRONTOFFICE_ISSUER || 'http://localhost:8080/realms/frontoffice',
    clientId: process.env.KEYCLOAK_FRONTOFFICE_CLIENT_ID || 'digitaltourism-web',
    clientSecret: process.env.KEYCLOAK_FRONTOFFICE_CLIENT_SECRET || '',
    callbackUrl:
      process.env.KEYCLOAK_FRONTOFFICE_CALLBACK_URL ||
      `${serverUrl}/api/visitors/oauth/keycloak/callback`,
    redirectUrl: serverUrl,
    collection: 'visitors',
    cookieName: 'payload-visitor-token',
    pkceCookieName: 'keycloak-pkce-frontoffice',
    idTokenCookieName: 'keycloak-id-token-frontoffice',
    allowedRoles: undefined, // All frontoffice users allowed
  },
}
