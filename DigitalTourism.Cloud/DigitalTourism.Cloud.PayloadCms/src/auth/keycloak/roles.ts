import { decodeJwt } from 'jose'

// Extract roles from Keycloak token claims
export function extractRolesFromToken(accessToken: string): string[] {
  try {
    const claims = decodeJwt(accessToken)

    const realmAccess = claims['realm_access'] as { roles?: string[] } | undefined
    if (realmAccess?.roles) {
      return realmAccess.roles
    }

    const customRoles = claims['realm_access.roles']
    if (Array.isArray(customRoles)) {
      return customRoles as string[]
    }

    return []
  } catch {
    return []
  }
}

// Check if user has any of the allowed roles
export function hasAllowedRole(roles: string[], allowedRoles?: string[]): boolean {
  if (!allowedRoles) return true // No role restriction
  return roles.some((role) => allowedRoles.includes(role))
}
