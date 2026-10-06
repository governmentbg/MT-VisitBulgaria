import { createLogger } from '@/plugins/logging'
import { realmConfigs } from '../keycloak'
import type { BackofficeConfig } from './types'

export const logger = createLogger('auth:keycloak-admin')

export function getConfig(): BackofficeConfig {
  return {
    issuer: realmConfigs.backoffice.issuer,
    serviceClientId: process.env.KEYCLOAK_BACKOFFICE_SERVICE_CLIENT_ID || 'digitaltourism-cms-service',
    serviceClientSecret: process.env.KEYCLOAK_BACKOFFICE_SERVICE_SECRET || '',
  }
}

export function getBaseUrl(issuer: string): string {
  const url = new URL(issuer)
  return `${url.protocol}//${url.host}`
}

export function getRealmName(issuer: string): string {
  const match = issuer.match(/\/realms\/([^/]+)/)
  return match ? match[1] : 'digitaltourism'
}
