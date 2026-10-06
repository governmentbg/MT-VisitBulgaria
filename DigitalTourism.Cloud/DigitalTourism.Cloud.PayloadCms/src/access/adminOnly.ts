import type { Access } from 'payload'

/**
 * Admin-only access control
 * Used for geography collections management (regions, municipalities, cities)
 */
export const adminOnly: Access = ({ req: { user } }) => {
  if (!user) return false

  // Check if user is authenticated and has admin role
  if (user.collection === 'users') {
    const userRoles = (user.roles as string[]) || []
    return userRoles.includes('admin')
  }

  return false
}
