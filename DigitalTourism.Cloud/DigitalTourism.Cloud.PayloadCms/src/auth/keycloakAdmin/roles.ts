import type { KeycloakRoleRepresentation } from './types'
import { logger, getConfig, getBaseUrl, getRealmName } from './config'
import { getBackofficeServiceToken } from './token'

/**
 * Gets available realm roles that can be assigned to a user.
 * Used to get role IDs before assignment.
 */
export async function getAvailableRealmRoles(
  keycloakId: string,
): Promise<KeycloakRoleRepresentation[]> {
  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(
    `${baseUrl}/admin/realms/${realm}/users/${keycloakId}/role-mappings/realm/available`,
    {
      headers: { Authorization: `Bearer ${serviceToken}` },
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()
    logger.error('Failed to get available realm roles', {
      keycloakId,
      status: response.status,
      error: errorBody,
    })
    throw new Error(`Failed to get available realm roles: ${response.status}`)
  }

  return response.json()
}

/**
 * Gets the current realm roles assigned to a user.
 */
export async function getUserRealmRoles(
  keycloakId: string,
): Promise<KeycloakRoleRepresentation[]> {
  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(
    `${baseUrl}/admin/realms/${realm}/users/${keycloakId}/role-mappings/realm`,
    {
      headers: { Authorization: `Bearer ${serviceToken}` },
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()
    logger.error('Failed to get user realm roles', {
      keycloakId,
      status: response.status,
      error: errorBody,
    })
    throw new Error(`Failed to get user realm roles: ${response.status}`)
  }

  return response.json()
}

/**
 * Assigns realm roles to a user in the backoffice Keycloak realm.
 */
export async function assignRealmRoles(
  keycloakId: string,
  roles: KeycloakRoleRepresentation[],
): Promise<void> {
  if (roles.length === 0) return

  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(
    `${baseUrl}/admin/realms/${realm}/users/${keycloakId}/role-mappings/realm`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roles),
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()
    logger.error('Failed to assign realm roles', {
      keycloakId,
      roles: roles.map((r) => r.name),
      status: response.status,
      error: errorBody,
    })
    throw new Error(`Failed to assign realm roles: ${response.status}`)
  }

  logger.info('Assigned realm roles', { keycloakId, roles: roles.map((r) => r.name) })
}

/**
 * Removes realm roles from a user in the backoffice Keycloak realm.
 */
export async function removeRealmRoles(
  keycloakId: string,
  roles: KeycloakRoleRepresentation[],
): Promise<void> {
  if (roles.length === 0) return

  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(
    `${baseUrl}/admin/realms/${realm}/users/${keycloakId}/role-mappings/realm`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roles),
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()
    logger.error('Failed to remove realm roles', {
      keycloakId,
      roles: roles.map((r) => r.name),
      status: response.status,
      error: errorBody,
    })
    throw new Error(`Failed to remove realm roles: ${response.status}`)
  }

  logger.info('Removed realm roles', { keycloakId, roles: roles.map((r) => r.name) })
}
