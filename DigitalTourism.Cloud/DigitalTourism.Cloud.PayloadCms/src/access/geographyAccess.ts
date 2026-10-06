import type { Access } from 'payload'
import { isAdmin } from './accessHelpers'

/**
 * Geography Collections Access (Regions, Municipalities, Cities)
 * - Admin: Full CRUD access
 * - All others (including Tourism Curator): Read-only access
 */

/**
 * Create Access - Admin only
 */
export const geographyCreateAccess: Access = ({ req: { user } }) => {
  return isAdmin(user)
}

/**
 * Read Access - All authenticated users
 */
export const geographyReadAccess: Access = ({ req: { user } }) => {
  // Allow all authenticated users to read geography data
  return !!user
}

/**
 * Update Access - Admin only
 */
export const geographyUpdateAccess: Access = ({ req: { user } }) => {
  return isAdmin(user)
}

/**
 * Delete Access - Admin only
 */
export const geographyDeleteAccess: Access = ({ req: { user } }) => {
  return isAdmin(user)
}
