import { keycloakLogout } from '@/auth/keycloak'

export async function GET(request: Request): Promise<Response> {
  return keycloakLogout('backoffice', request)
}
