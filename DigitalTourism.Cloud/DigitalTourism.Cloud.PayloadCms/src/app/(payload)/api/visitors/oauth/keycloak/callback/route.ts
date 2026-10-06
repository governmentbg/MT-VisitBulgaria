import { keycloakCallback } from '@/auth/keycloak'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  return keycloakCallback('frontoffice', request, payload)
}
