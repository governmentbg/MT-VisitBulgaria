import { getPayloadClient } from '@/payload/payloadClient'
import { headers } from 'next/headers'
import type { User, Visitor } from '@/payload-types'

// Type Guards
function isUser(user: unknown): user is User {
  return typeof user === 'object' && user !== null && 'roles' in user
}

function isVisitor(user: unknown): user is Visitor {
  return typeof user === 'object' && user !== null && ('preferences' in user || 'language' in user)
}

export async function getCurrentUser(): Promise<
  (User & { collection: 'users' }) | (Visitor & { collection: 'visitors' }) | null
> {
  const headersList = await headers()
  const payload = await getPayloadClient()

  // Try to get token from 'payload-token' cookie first (usually Visitors)
  // Payload might prioritize the 'Authorization' header if present (Backoffice token).
  // We need to explicitly check cookies if we are in a dual-auth scenario.

  // Actually, Payload's `auth` method reads from headers.
  // If you are logged in to BO, your browser might be sending the BO token in a way that Payload prioritizes?
  // Or, since both use `payload-token` cookie name by default, the BO cookie might be overwriting or taking precedence.
  // BUT: Visitors and Users are different collections.

  // If `disableLocalStrategy: true` is set for both, they likely rely on JWTs from Keycloak or similar.
  // If they share the same domain and cookie name, you have a collision.
  // Let's debug the cookies.
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  // If we have multiple tokens or specific ones, we might need a custom strategy or manually decode.
  // But standard Payload auth:
  // Check for specialized visitor token first
  const visitorToken = cookieStore.get('payload-visitor-token')?.value

  let user = null

  if (visitorToken) {
    const result = await payload.auth({
      headers: new Headers({
        Cookie: `payload-visitor-token=${visitorToken}`,
      }),
    })
    user = result.user
  }

  // Fallback to standard auth (admin token or shared token)
  if (!user) {
    const result = await payload.auth({ headers: headersList })
    user = result.user
  }

  if (!user) {
    return null
  }

  // Check if collection is already present
  if ('collection' in user) {
    // If explicit collection is set, trust it BUT...
    // The log showed explicit 'collection' key IS present.
    // And it resoloved to "users".
    // This means Payload Auth found a user in the "users" collection (Admins/Curators).

    // If you are indeed logged in as a "User" (e.g. admin), you CANNOT create trips.
    // YOU MUST BE A VISITOR.

    // However, if the user object has keys like 'roles', it IS a User.
    // The log shows: ['id', 'firstName', 'lastName', 'email', 'keycloakId', 'roles', 'assignedMunicipality', 'updatedAt', 'createdAt', 'collection']
    // This is unequivocally a USER (Admin/staff), not a Visitor.
    // Visitors do NOT have 'roles' or 'assignedMunicipality'.

    if (user.collection === 'users') return user as User & { collection: 'users' }
    if (user.collection === 'visitors') return user as Visitor & { collection: 'visitors' }

    // If unknown collection but has it?
    return user as any
  }

  // Polyfill collection property if missing
  if (isUser(user)) {
    return { ...(user as any), collection: 'users' }
  }

  if (isVisitor(user)) {
    return { ...(user as any), collection: 'visitors' }
  }

  return null
}
