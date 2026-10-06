import type { Payload } from 'payload'
import type { User, Visitor } from '@/payload-types'
import { type RealmType, type UserRole, realmConfigs } from './types'

// Helper function to find or create a user/visitor based on Keycloak identity
export async function findOrCreateUser(
  payload: Payload,
  realm: RealmType,
  keycloakUser: {
    keycloakId: string
    email: string
    firstName: string
    lastName: string
    name: string
    roles: string[]
    language?: string
  },
): Promise<User | Visitor> {
  const config = realmConfigs[realm]

  if (realm === 'backoffice') {
    // Handle backoffice (users collection)
    const existingByKeycloakId = await payload.find({
      collection: 'users',
      where: { keycloakId: { equals: keycloakUser.keycloakId } },
      limit: 1,
    })

    if (existingByKeycloakId.docs.length > 0) {
      const existing = existingByKeycloakId.docs[0]
      const allowedRoles = keycloakUser.roles.filter((role) =>
        config.allowedRoles?.includes(role as UserRole),
      ) as UserRole[]

      await payload.update({
        collection: 'users',
        id: existing.id,
        data: {
          ...(allowedRoles.length > 0 ? { roles: allowedRoles } : {}),
          firstName: keycloakUser.firstName,
          lastName: keycloakUser.lastName,
          lastLogin: new Date().toISOString(),
        },
        context: { skipKeycloakSync: true },
      })
      return existing
    }

    const existingByEmail = await payload.find({
      collection: 'users',
      where: { email: { equals: keycloakUser.email } },
      limit: 1,
    })

    if (existingByEmail.docs.length > 0) {
      const existing = existingByEmail.docs[0]
      const allowedRoles = keycloakUser.roles.filter((role) =>
        config.allowedRoles?.includes(role as UserRole),
      ) as UserRole[]

      await payload.update({
        collection: 'users',
        id: existing.id,
        data: {
          keycloakId: keycloakUser.keycloakId,
          firstName: keycloakUser.firstName,
          lastName: keycloakUser.lastName,
          lastLogin: new Date().toISOString(),
          ...(allowedRoles.length > 0 ? { roles: allowedRoles } : {}),
        },
        context: { skipKeycloakSync: true },
      })
      return existing
    }

    // Create new user
    const allowedRoles = keycloakUser.roles.filter((role) =>
      config.allowedRoles?.includes(role as UserRole),
    ) as UserRole[]

    return await payload.create({
      collection: 'users',
      data: {
        email: keycloakUser.email,
        firstName: keycloakUser.firstName,
        lastName: keycloakUser.lastName,
        keycloakId: keycloakUser.keycloakId,
        roles: allowedRoles,
        lastLogin: new Date().toISOString(),
      },
      context: { skipKeycloakSync: true },
    })
  } else {
    // Handle frontoffice (visitors collection)
    const existingByKeycloakId = await payload.find({
      collection: 'visitors',
      where: { keycloakId: { equals: keycloakUser.keycloakId } },
      limit: 1,
    })

    if (existingByKeycloakId.docs.length > 0) {
      const existing = existingByKeycloakId.docs[0]
      if (keycloakUser.language) {
        await payload.update({
          collection: 'visitors',
          id: existing.id,
          data: { language: keycloakUser.language as 'en' | 'bg' | 'de' | 'fr' },
        })
      }
      return existing
    }

    const existingByEmail = await payload.find({
      collection: 'visitors',
      where: { email: { equals: keycloakUser.email } },
      limit: 1,
    })

    if (existingByEmail.docs.length > 0) {
      const existing = existingByEmail.docs[0]
      await payload.update({
        collection: 'visitors',
        id: existing.id,
        data: {
          keycloakId: keycloakUser.keycloakId,
          ...(keycloakUser.language
            ? { language: keycloakUser.language as 'en' | 'bg' | 'de' | 'fr' }
            : {}),
        },
      })
      return existing
    }

    // Create new visitor
    return await payload.create({
      collection: 'visitors',
      data: {
        email: keycloakUser.email,
        name: keycloakUser.name,
        keycloakId: keycloakUser.keycloakId,
        language: (keycloakUser.language as 'en' | 'bg' | 'de' | 'fr') || 'en',
      },
    })
  }
}
