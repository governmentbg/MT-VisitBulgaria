import type { Access, FieldAccess } from 'payload'
import { isAdmin, isCuratorOrAdmin } from './accessHelpers'

/**
 * Users Collection Access Control
 */

/**
 * Create Access - Admin and Tourism Curator
 * Admins and Tourism Curators can create new users (for creating moderators)
 */
export const userCreateAccess: Access = ({ req: { user } }) => {
  return isCuratorOrAdmin(user)
}

/**
 * Read Access
 * - Admin: Can read all users
 * - Tourism Curator: Can read all users (for assigning moderators)
 * - Others: Can only read themselves
 */
export const userReadAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admin and Tourism Curator can read all users
  if (isCuratorOrAdmin(user)) return true

  // Others can only read themselves
  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * Update Access
 * - Admin: Can update all users
 * - Tourism Curator: Can update all users (for assigning municipalities)
 * - Others: Can only update themselves (limited fields via field-level access)
 */
export const userUpdateAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admin and Tourism Curator can update all users
  if (isCuratorOrAdmin(user)) return true

  // Others can only update themselves
  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * Delete Access - Admin only
 */
export const userDeleteAccess: Access = ({ req: { user } }) => {
  return isAdmin(user)
}

/**
 * Field-level access: roles field
 * - Admin: Can modify any user's roles
 * - Tourism Curator: Can modify any user's roles (for assigning moderator role)
 * - Others: Read-only
 *
 * Use separate read/write access on the field's access property:
 * access: { read: rolesFieldReadAccess, create: rolesFieldWriteAccess, update: rolesFieldWriteAccess }
 */
export const rolesFieldReadAccess: FieldAccess = () => true

export const rolesFieldWriteAccess: FieldAccess = ({ req: { user } }) => {
  return isCuratorOrAdmin(user)
}

/**
 * Field-level access: assignedMunicipality field
 * - Admin: Can assign municipality to any user
 * - Tourism Curator: Can assign municipality to municipal moderators
 * - Others: Read-only
 *
 * Use separate read/write access on the field's access property:
 * access: { read: assignedMunicipalitiesReadAccess, create: assignedMunicipalitiesWriteAccess, update: assignedMunicipalitiesWriteAccess }
 */
export const assignedMunicipalitiesReadAccess: FieldAccess = () => true

export const assignedMunicipalitiesWriteAccess: FieldAccess = ({ req: { user } }) => {
  return isCuratorOrAdmin(user)
}
