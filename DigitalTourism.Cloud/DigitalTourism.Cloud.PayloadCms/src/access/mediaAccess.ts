import type { Access, BaseListFilter, FilterOptions, Where } from 'payload'
import type { User } from '@/payload-types'
import {
  isAdmin,
  isMunicipalModerator,
  isBusinessOwner,
  isCuratorOrAdmin,
} from './accessHelpers'

/**
 * Helper to extract municipality ID from user (1:1 relationship)
 */
const extractMunicipalityId = (user: User): number | null => {
  const raw = user.assignedMunicipality
  if (!raw) return null
  const id = typeof raw === 'object' && raw !== null ? (raw as any).id : raw
  return id != null && !isNaN(Number(id)) ? Number(id) : null
}

/**
 * Returns a Where clause restricting media to what this user owns.
 * Pure function — safe to use both server-side and client-side.
 * Uses a nested relationship query for municipal moderators (no async needed).
 */
const getMediaOwnerFilter = (user: any): Where | boolean => {
  if (!user || user.collection !== 'users') return true
  if (isCuratorOrAdmin(user)) return true

  if (isBusinessOwner(user)) {
    return { createdBy: { equals: user.id } }
  }

  if (isMunicipalModerator(user)) {
    const municipalityId = extractMunicipalityId(user as User)
    if (municipalityId != null) {
      return {
        'createdBy.assignedMunicipality': { equals: municipalityId },
      }
    }
  }

  return false
}

/**
 * Media Read Access
 * All users can read all media.
 * Admin-panel restrictions are enforced via baseListFilter and filterOptions.
 */
export const mediaReadAccess: Access = () => true

/**
 * Media Update Access
 * - Admin/Tourism Curator: Full access
 * - Business Owner: Own uploads only
 * - Municipal Moderator: Uploads from users in same municipality
 * - Public/Visitors: No update access
 */
export const mediaUpdateAccess: Access = async ({ req: { user, payload } }) => {
  if (!user) return false
  if (user.collection === 'visitors') return false
  if (isCuratorOrAdmin(user)) return true

  const constraints: Where[] = []

  if (isBusinessOwner(user)) {
    constraints.push({ createdBy: { equals: user.id } })
  }

  if (isMunicipalModerator(user)) {
    const municipalityId = extractMunicipalityId(user)
    if (municipalityId != null) {
      const usersInMunicipality = await payload.find({
        collection: 'users',
        where: { assignedMunicipality: { equals: municipalityId } },
        limit: 1000,
      })
      const userIds = usersInMunicipality.docs.map((u: any) => u.id)
      userIds.push(user.id)
      constraints.push({ createdBy: { in: userIds } })
    }
  }

  if (constraints.length === 0) return false
  return constraints.length === 1 ? constraints[0] : { or: constraints }
}

/**
 * Media Delete Access
 * Admin only
 */
export const mediaDeleteAccess: Access = ({ req: { user } }) => isAdmin(user)

/**
 * Base list filter for the Media collection admin list page.
 * Restricts which media appears in the admin list view by role.
 */
export const mediaBaseListFilter: BaseListFilter = async ({ req: { user, payload } }): Promise<Where> => {
  if (!user || user.collection !== 'users') return {}
  if (isCuratorOrAdmin(user)) return {}

  if (isBusinessOwner(user)) {
    return { createdBy: { equals: user.id } }
  }

  if (isMunicipalModerator(user)) {
    const municipalityId = extractMunicipalityId(user)
    if (municipalityId != null) {
      const usersInMunicipality = await payload.find({
        collection: 'users',
        where: { assignedMunicipality: { equals: municipalityId } },
        limit: 1000,
      })
      const userIds = usersInMunicipality.docs.map((u: any) => u.id)
      userIds.push(user.id)
      return { createdBy: { in: userIds } }
    }
  }

  // Deny: match nothing
  return { id: { equals: -1 } }
}

/**
 * Filter options for upload/relationship fields pointing to media.
 * Restricts which media appears in pickers based on user role:
 * - Admin/Curator: No restriction
 * - Business Owner: Only own uploads
 * - Municipal Moderator: Uploads from users in same municipality
 */
export const mediaFilterOptions: FilterOptions = ({ user }) => {
  return getMediaOwnerFilter(user)
}

/**
 * Combines an existing static Where filter with the media ownership filter.
 * Use when a field already has filterOptions (e.g., mimeType restriction).
 */
export const withMediaOwnerFilter = (existingFilter: Where): FilterOptions => {
  return ({ user }) => {
    const ownerFilter = getMediaOwnerFilter(user)
    if (ownerFilter === true) return existingFilter
    if (ownerFilter === false) return false
    return { and: [existingFilter, ownerFilter] }
  }
}
