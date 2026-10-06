import type { KeycloakUserRepresentation } from './types'
import { logger, getConfig, getBaseUrl, getRealmName } from './config'
import { getBackofficeServiceToken } from './token'

/**
 * Creates a new user in the backoffice Keycloak realm.
 * Returns the Keycloak user ID on success.
 */
export async function createBackofficeUser(data: {
  email: string
  firstName: string
  lastName: string
}): Promise<string> {
  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(`${baseUrl}/admin/realms/${realm}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: data.email,
      email: data.email,
      emailVerified: false,
      enabled: true,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
    }),
  })

  if (response.status === 409) {
    throw new Error(`User with email ${data.email} already exists in Keycloak`)
  }

  if (response.status !== 201) {
    const errorBody = await response.text()
    logger.error('Failed to create backoffice user', {
      status: response.status,
      error: errorBody,
    })
    throw new Error(`Failed to create backoffice user: ${response.status}`)
  }

  const location = response.headers.get('Location')
  const userId = location?.split('/').pop()
  if (!userId) {
    throw new Error('Failed to extract user ID from Location header')
  }

  logger.info('Created backoffice user in Keycloak', { email: data.email, keycloakId: userId })
  return userId
}

/**
 * Updates an existing user in the backoffice Keycloak realm.
 */
export async function updateBackofficeUser(
  keycloakId: string,
  data: {
    email?: string
    firstName?: string
    lastName?: string
    enabled?: boolean
  },
): Promise<void> {
  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(`${baseUrl}/admin/realms/${realm}/users/${keycloakId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    logger.error('Failed to update backoffice user', {
      keycloakId,
      status: response.status,
      error: errorBody,
    })
    throw new Error(`Failed to update backoffice user: ${response.status}`)
  }

  logger.info('Updated backoffice user in Keycloak', { keycloakId })
}

/**
 * Lists all users in the backoffice Keycloak realm.
 */
export async function listAllBackofficeUsers(): Promise<KeycloakUserRepresentation[]> {
  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(`${baseUrl}/admin/realms/${realm}/users?max=1000`, {
    headers: { Authorization: `Bearer ${serviceToken}` },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    logger.error('Failed to list backoffice users', {
      status: response.status,
      error: errorBody,
    })
    throw new Error(`Failed to list backoffice users: ${response.status}`)
  }

  return response.json()
}

/**
 * Finds a user in the backoffice Keycloak realm by exact email match.
 */
export async function findBackofficeUserByEmail(
  email: string,
): Promise<KeycloakUserRepresentation | null> {
  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(
    `${baseUrl}/admin/realms/${realm}/users?email=${encodeURIComponent(email)}&exact=true`,
    {
      headers: { Authorization: `Bearer ${serviceToken}` },
    },
  )

  if (!response.ok) {
    logger.error('Failed to find backoffice user by email', {
      email,
      status: response.status,
    })
    return null
  }

  const users: KeycloakUserRepresentation[] = await response.json()
  return users.length > 0 ? users[0] : null
}

/**
 * Sends a welcome email to a newly created user via Keycloak's execute-actions-email.
 * The email prompts the user to verify their email address and set their password.
 */
export async function sendSetPasswordEmail(keycloakId: string): Promise<void> {
  const config = getConfig()
  const baseUrl = getBaseUrl(config.issuer)
  const realm = getRealmName(config.issuer)
  const serviceToken = await getBackofficeServiceToken()

  const response = await fetch(
    `${baseUrl}/admin/realms/${realm}/users/${keycloakId}/execute-actions-email`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['VERIFY_EMAIL', 'UPDATE_PASSWORD']),
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()
    logger.error('Failed to send set password email', {
      keycloakId,
      status: response.status,
      error: errorBody,
    })
    throw new Error(`Failed to send set password email: ${response.status}`)
  }

  logger.info('Sent set password email', { keycloakId })
}
