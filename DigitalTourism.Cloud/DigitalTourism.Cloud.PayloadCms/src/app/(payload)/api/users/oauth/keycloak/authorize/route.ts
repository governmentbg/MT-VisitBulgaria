import { keycloakAuthorize } from '@/auth/keycloak'

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const loginHint = url.searchParams.get('login_hint') || undefined
  const locale = url.searchParams.get('locale') || undefined
  return keycloakAuthorize('backoffice', loginHint, undefined, locale)
}
