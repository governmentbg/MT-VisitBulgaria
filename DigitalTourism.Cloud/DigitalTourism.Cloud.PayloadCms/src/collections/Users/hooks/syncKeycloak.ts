import type { CollectionAfterChangeHook } from 'payload'
import type { User } from '@/payload-types'
import { createLogger } from '@/plugins/logging'
import {
  createBackofficeUser,
  updateBackofficeUser,
  getAvailableRealmRoles,
  getUserRealmRoles,
  assignRealmRoles,
  removeRealmRoles,
  sendSetPasswordEmail,
} from '@/auth/keycloakAdmin'
import { type UserRole, ALLOWED_ROLES } from '@/auth/keycloak'

const logger = createLogger('hooks:user-keycloak-sync')

/**
 * afterChange hook that syncs user data to Keycloak.
 *
 * Runs asynchronously in the background — never blocks the Payload response.
 * The Payload save completes and the HTTP response returns immediately;
 * the sync status is updated in a separate write after the transaction commits.
 *
 * Skipped when req.context.skipKeycloakSync is true (SSO login, sync job).
 */
export const syncUserToKeycloak: CollectionAfterChangeHook<User> = ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  if (req.context.skipKeycloakSync) {
    return doc
  }

  // Fire-and-forget: schedule sync after the current transaction commits
  const payload = req.payload
  const docId = doc.id

  if (operation === 'create' && !doc.keycloakId) {
    setImmediate(() => {
      handleCreate(doc, payload, docId).catch((error) => {
        logger.error('Keycloak sync failed (create)', {
          email: doc.email,
          error: String(error),
        })
      })
    })
  } else if (operation === 'update' && doc.keycloakId) {
    setImmediate(() => {
      handleUpdate(doc, previousDoc, payload, docId).catch((error) => {
        logger.error('Keycloak sync failed (update)', {
          email: doc.email,
          error: String(error),
        })
      })
    })
  }

  return doc
}

async function updateSyncStatus(
  payload: any,
  docId: number | string,
  email: string,
  data: Record<string, unknown>,
) {
  try {
    await payload.update({
      collection: 'users',
      id: docId,
      data,
      context: { skipKeycloakSync: true },
    })
  } catch (error) {
    logger.error('Failed to update Keycloak sync status', {
      email,
      error: String(error),
    })
  }
}

async function handleCreate(doc: User, payload: any, docId: number | string) {
  try {
    logger.info('Creating user in Keycloak', { email: doc.email })

    const keycloakId = await createBackofficeUser({
      email: doc.email,
      firstName: doc.firstName || '',
      lastName: doc.lastName || '',
    })

    // Assign roles
    const docRoles = ((doc.roles as UserRole[]) || []).filter((r) => ALLOWED_ROLES.includes(r))
    if (docRoles.length > 0) {
      const availableRoles = await getAvailableRealmRoles(keycloakId)
      const rolesToAssign = availableRoles.filter((r) => docRoles.includes(r.name as UserRole))
      await assignRealmRoles(keycloakId, rolesToAssign)
    }

    // Send email verification + password setup email
    try {
      await sendSetPasswordEmail(keycloakId)
    } catch (error) {
      logger.error('Failed to send welcome email (user was still created)', {
        email: doc.email,
        error: String(error),
      })
    }

    // Update Payload record with keycloakId and sync status
    await updateSyncStatus(payload, docId, doc.email, {
      keycloakId,
      keycloakSyncStatus: 'synced',
      keycloakSyncedAt: new Date().toISOString(),
    })

    logger.info('User created and synced to Keycloak', { email: doc.email, keycloakId })
  } catch (error) {
    logger.error('Failed to sync new user to Keycloak', {
      email: doc.email,
      error: String(error),
    })

    await updateSyncStatus(payload, docId, doc.email, {
      keycloakSyncStatus: 'error',
    })
  }
}

async function handleUpdate(doc: User, previousDoc: User, payload: any, docId: number | string) {
  const keycloakId = doc.keycloakId!
  try {
    logger.info('Updating user in Keycloak', { email: doc.email, keycloakId })

    // Update user attributes
    await updateBackofficeUser(keycloakId, {
      email: doc.email,
      firstName: doc.firstName || '',
      lastName: doc.lastName || '',
      enabled: doc.isActive !== false,
    })

    // Sync role changes
    const currentRoles = ((doc.roles as UserRole[]) || []).filter((r) =>
      ALLOWED_ROLES.includes(r),
    )
    const previousRoles = ((previousDoc.roles as UserRole[]) || []).filter((r) =>
      ALLOWED_ROLES.includes(r),
    )

    const rolesToAdd = currentRoles.filter((r) => !previousRoles.includes(r))
    const rolesToRemove = previousRoles.filter((r) => !currentRoles.includes(r))

    if (rolesToAdd.length > 0) {
      const availableRoles = await getAvailableRealmRoles(keycloakId)
      const keycloakRolesToAdd = availableRoles.filter((r) =>
        rolesToAdd.includes(r.name as UserRole),
      )
      await assignRealmRoles(keycloakId, keycloakRolesToAdd)
    }

    if (rolesToRemove.length > 0) {
      const currentKeycloakRoles = await getUserRealmRoles(keycloakId)
      const keycloakRolesToRemove = currentKeycloakRoles.filter((r) =>
        rolesToRemove.includes(r.name as UserRole),
      )
      await removeRealmRoles(keycloakId, keycloakRolesToRemove)
    }

    // Update sync status
    await updateSyncStatus(payload, docId, doc.email, {
      keycloakSyncStatus: 'synced',
      keycloakSyncedAt: new Date().toISOString(),
    })

    logger.info('User updated and synced to Keycloak', { email: doc.email, keycloakId })
  } catch (error) {
    logger.error('Failed to sync user update to Keycloak', {
      email: doc.email,
      keycloakId,
      error: String(error),
    })

    await updateSyncStatus(payload, docId, doc.email, {
      keycloakSyncStatus: 'error',
    })
  }
}
