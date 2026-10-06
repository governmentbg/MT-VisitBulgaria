import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

/**
 * Check if a CMS admin user is authenticated (from 'users' collection)
 * This is the default Payload convention for admin panel access
 */
export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return user?.collection === 'users'
}

/**
 * Check if a frontend visitor is authenticated (from 'visitors' collection)
 * Use this for frontend features that require visitor authentication
 */
export const visitorAuthenticated: isAuthenticated = ({ req: { user } }) => {
  return user?.collection === 'visitors'
}

/**
 * Check if any user is authenticated (admin or visitor)
 * Use this when both admin users and visitors should have access
 */
export const anyAuthenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}
