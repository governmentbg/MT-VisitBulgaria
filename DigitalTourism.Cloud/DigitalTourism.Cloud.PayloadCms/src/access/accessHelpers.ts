import type { Access, FieldAccess } from 'payload'

 
type AnyUser = any

/**
 * Base role check helper
 * Checks if a user has a specific role
 * Works with various user types (User, ClientUser, etc.)
 */
export const hasRole = (user: AnyUser, role: string): boolean => {
  if (!user) return false
  // Check if user is from 'users' collection (not 'visitors')
  if (user.collection && user.collection !== 'users') return false
  // Extract roles - only User type has roles, not Visitor
  const userRoles = (user.roles as string[]) || []
  return userRoles.includes(role)
}

// Individual role check helpers
export const isAdmin = (user: AnyUser): boolean => hasRole(user, 'admin')
export const isTourismCurator = (user: AnyUser): boolean => hasRole(user, 'tourism-curator')
export const isMunicipalModerator = (user: AnyUser): boolean =>
  hasRole(user, 'municipal-moderator')
export const isBusinessOwner = (user: AnyUser): boolean => hasRole(user, 'business-owner')

// Combined role checks
export const isCuratorOrAdmin = (user: AnyUser): boolean =>
  isAdmin(user) || isTourismCurator(user)

/**
 * Nav visibility function: Hide from non-admin users
 * Use for collections/globals that should only be visible to admins:
 * - Regions, Municipalities, Visitors
 */
export const hiddenFromNonAdmin = ({ user }: { user: AnyUser }): boolean => {
  return !isAdmin(user)
}

/**
 * Nav visibility function: Hide from non-curator users
 * Use for collections/globals that should be visible to Tourism Curators and Admins:
 * - Users, Cities, Pages, Posts, Categories, Footer, MainMenu
 */
export const hiddenFromNonCurator = ({ user }: { user: AnyUser }): boolean => {
  return !isCuratorOrAdmin(user)
}

/**
 * Access control: Admin only
 * Use for operations restricted to admin users
 */
export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

/**
 * Field-level access control: Admin only
 * Use for field-level operations restricted to admin users
 */
export const fieldAdminOnly: FieldAccess = ({ req: { user } }) => isAdmin(user)

/**
 * Access control: Curator or Admin
 * Use for operations allowed for Tourism Curators and Admins
 */
export const curatorOrAdmin: Access = ({ req: { user } }) => isCuratorOrAdmin(user)
