import type { Access, FieldAccess, Where } from 'payload'
import type { User, Visitor } from '@/payload-types'
import { hasRole } from './accessHelpers'

type AuthUser = User | Visitor | null

/**
 * Helper: Check if user is admin or tourism curator (full access roles)
 */
const hasFullAccess = (user: AuthUser): boolean => {
  return hasRole(user, 'admin') || hasRole(user, 'tourism-curator')
}

/**
 * Helper: Business owner access - can only access own experiences
 * Returns query constraint for experiences where createdBy matches user
 */
export const businessOwnerAccess = (user: AuthUser): Where | boolean => {
  if (!user || !hasRole(user, 'business-owner')) return false

  return {
    createdBy: {
      equals: user.id,
    },
  }
}

/**
 * Helper: Municipal moderator access - can only access experiences in assigned municipality
 * Returns query constraint for experiences where city's municipality matches user's assignedMunicipality
 */
export const municipalModeratorAccess = async (
  user: AuthUser,
  payload: any,
): Promise<Where | boolean> => {
  if (!user || !hasRole(user, 'municipal-moderator')) return false

  // After hasRole check, user is guaranteed to be from 'users' collection
  const cmsUser = user as User

  // Extract municipality ID - handle both populated object and raw ID
  const raw = cmsUser.assignedMunicipality
  if (!raw) return false

  const municipalityId =
    typeof raw === 'object' && raw !== null && 'id' in raw ? raw.id : raw

  if (municipalityId == null || isNaN(Number(municipalityId))) return false

  // Need to find all cities in the assigned municipality
  const cities = await payload.find({
    collection: 'cities',
    where: {
      municipality: {
        equals: municipalityId,
      },
    },
    limit: 1000,
  })

  const cityIds = cities.docs.map((city: any) => city.id)

  if (cityIds.length === 0) return false

  return {
    city: {
      in: cityIds,
    },
  }
}

/**
 * Experience Create Access
 * - Admin: Yes
 * - Tourism Curator: Yes
 * - Municipal Moderator: Yes (assigned municipalities only - enforced at field level)
 * - Business Owner: Yes (draft only - status enforced at field level)
 */
export const experienceCreateAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admin and tourism curator have full access
  if (hasFullAccess(user)) return true

  // Municipal moderators can create
  if (hasRole(user, 'municipal-moderator')) return true

  // Business owners can create
  if (hasRole(user, 'business-owner')) return true

  return false
}

/**
 * Experience Read Access
 * - Public (unauthenticated): Can read published experiences
 * - Frontend Visitors (authenticated): Can read published experiences
 * - CMS Users (admin panel):
 *   - Admin: Can read all
 *   - Tourism Curator: Can read all
 *   - Municipal Moderator: Can read assigned municipalities only
 *   - Business Owner: Can read own experiences only
 */
export const experienceReadAccess: Access = async ({ req: { user, payload } }) => {
  // Public and frontend visitors can read published experiences
  if (!user || user.collection === 'visitors') {
    return {
      _status: {
        equals: 'published',
      },
    }
  }

  // From here, user is from 'users' collection (CMS admin panel)

  // Admin and tourism curator have full access
  if (hasFullAccess(user)) return true

  // Build OR conditions for role-based access
  const constraints: Where[] = []

  // Municipal moderator: assigned municipalities
  if (hasRole(user, 'municipal-moderator')) {
    const municipalAccess = await municipalModeratorAccess(user, payload)
    if (municipalAccess !== false) {
      constraints.push(municipalAccess as Where)
    }
  }

  // Business owner: own experiences
  if (hasRole(user, 'business-owner')) {
    const ownerAccess = businessOwnerAccess(user)
    if (ownerAccess !== false) {
      constraints.push(ownerAccess as Where)
    }
  }

  // If no constraints match, deny access
  if (constraints.length === 0) return false

  // Return OR of all constraints
  if (constraints.length === 1) return constraints[0]

  return {
    or: constraints,
  }
}

/**
 * Experience Update Access
 * - Admin: Can update all
 * - Tourism Curator: Can update all
 * - Municipal Moderator: Can update assigned municipalities only
 * - Business Owner: Can update own experiences only
 */
export const experienceUpdateAccess: Access = async ({ req: { user, payload } }) => {
  if (!user) return false

  // Admin and tourism curator have full access
  if (hasFullAccess(user)) return true

  // Build OR conditions for role-based access
  const constraints: Where[] = []

  // Municipal moderator: assigned municipalities
  if (hasRole(user, 'municipal-moderator')) {
    const municipalAccess = await municipalModeratorAccess(user, payload)
    if (municipalAccess !== false) {
      constraints.push(municipalAccess as Where)
    }
  }

  // Business owner: own experiences
  if (hasRole(user, 'business-owner')) {
    const ownerAccess = businessOwnerAccess(user)
    if (ownerAccess !== false) {
      constraints.push(ownerAccess as Where)
    }
  }

  // If no constraints match, deny access
  if (constraints.length === 0) return false

  // Return OR of all constraints
  if (constraints.length === 1) return constraints[0]

  return {
    or: constraints,
  }
}

/**
 * Experience Delete Access
 * - Admin only
 */
export const experienceDeleteAccess: Access = ({ req: { user } }) => {
  return hasRole(user, 'admin')
}

/**
 * Field-level access: _status field (publish/unpublish)
 * - Admin: Can publish/unpublish
 * - Tourism Curator: Can publish/unpublish
 * - Others: Read-only (enforced to draft for business owners)
 *
 * Use separate read/write access on the field's access property:
 * access: { read: statusFieldReadAccess, create: statusFieldWriteAccess, update: statusFieldWriteAccess }
 */
export const statusFieldReadAccess: FieldAccess = () => true

export const statusFieldWriteAccess: FieldAccess = ({ req: { user } }) => {
  return hasFullAccess(user)
}

/**
 * Field-level access: city field
 * - Admin: Can select any city
 * - Tourism Curator: Can select any city
 * - Municipal Moderator: Can only select cities in assigned municipalities (enforced via filterOptions)
 * - Business Owner: Can select any city
 * - No user (seeding): Allow access
 */
export const cityFieldAccess: FieldAccess = ({ req: { user } }) => {
  // Allow seeding operations (no user context)
  if (!user) return true

  // All authenticated CMS users can read and modify city field
  // Restriction for municipal moderators is enforced via filterOptions
  return true
}
