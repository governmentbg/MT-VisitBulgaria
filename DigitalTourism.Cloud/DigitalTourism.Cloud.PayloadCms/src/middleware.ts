import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const VISITOR_COOKIE_NAME = 'payload-visitor-token'
const ADMIN_COOKIE_NAME = 'payload-token'
const VISITOR_API_PREFIXES = ['/api/favorites', '/api/trips']
const SITE_ACCESS_COOKIE = 'site-access-token'
const SITE_ACCESS_CHECKED_COOKIE = 'site-access-checked'

/** Strip a named cookie from the request and continue with modified headers. */
function nextWithoutCookie(request: NextRequest, cookieName: string) {
  const requestHeaders = new Headers(request.headers)

  const filteredCookies = request.cookies
    .getAll()
    .filter((cookie) => cookie.name !== cookieName)
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ')

  requestHeaders.set('cookie', filteredCookies)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // For admin routes, remove the visitor cookie from the request
  // This prevents Payload from seeing visitors as authenticated in the admin panel
  if (pathname.startsWith('/admin')) {
    if (request.cookies.get(VISITOR_COOKIE_NAME)) {
      return nextWithoutCookie(request, VISITOR_COOKIE_NAME)
    }

    return NextResponse.next()
  }

  // For visitor-facing API routes, strip the admin cookie when both are present.
  // This ensures Payload resolves req.user to the visitor (not the admin user),
  // so field-level beforeChange hooks correctly populate the visitor field.
  // When only the admin cookie is present, pass through unchanged for admin access.
  if (VISITOR_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (request.cookies.get(ADMIN_COOKIE_NAME) && request.cookies.get(VISITOR_COOKIE_NAME)) {
      return nextWithoutCookie(request, ADMIN_COOKIE_NAME)
    }

    return NextResponse.next()
  }

  // Site password protection gate
  // Skip for: API routes, static files, Next.js internals, the site-access page,
  // admin users (payload-token), and draft/preview mode (__next_preview_data)
  const isSiteAccessPage = /^\/[a-z]{2}\/site-access(\/.*)?$/.test(pathname)
  const isAdminUser = request.cookies.has(ADMIN_COOKIE_NAME)
  const isDraftMode = request.cookies.has('__next_preview_data')
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/next') &&
    !pathname.includes('.') &&
    !isSiteAccessPage &&
    !isAdminUser &&
    !isDraftMode
  ) {
    // If we recently validated (site-access-checked cookie), skip the check entirely
    if (!request.cookies.has(SITE_ACCESS_CHECKED_COOKIE)) {
      try {
        const settingsUrl = new URL('/api/globals/settings', request.nextUrl.origin)
        settingsUrl.searchParams.set('depth', '0')
        const res = await fetch(settingsUrl.toString())
        if (res.ok) {
          const settings = await res.json()
          if (settings.sitePasswordEnabled && settings.sitePasswordHash) {
            // Protection is enabled — validate the cookie HMAC against current hash
            const cookieValue = request.cookies.get(SITE_ACCESS_COOKIE)?.value
            let isValid = false
            if (cookieValue) {
              const secret = process.env.PAYLOAD_SECRET || 'fallback-secret'
              const encoder = new TextEncoder()
              const key = await crypto.subtle.importKey(
                'raw',
                encoder.encode(secret),
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign'],
              )
              const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(settings.sitePasswordHash))
              const expected = Array.from(new Uint8Array(sig))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
              isValid = cookieValue === expected
            }

            if (!isValid) {
              // Invalid or missing cookie — redirect to password page
              const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/)
              const locale = localeMatch?.[1] || 'en'
              const redirectUrl = new URL(`/${locale}/site-access`, request.url)
              redirectUrl.searchParams.set('returnTo', pathname)
              const redirectResponse = NextResponse.redirect(redirectUrl)
              // Clear stale cookie if present
              if (cookieValue) {
                redirectResponse.cookies.delete(SITE_ACCESS_COOKIE)
              }
              return redirectResponse
            }

            // Cookie is valid — cache this result for 5 minutes
            const response = intlMiddleware(request)
            response.cookies.set(SITE_ACCESS_CHECKED_COOKIE, '1', {
              maxAge: 300,
              path: '/',
            })
            return response
          }
        }
        // Protection is disabled — cache this for 5 minutes
        const response = intlMiddleware(request)
        response.cookies.set(SITE_ACCESS_CHECKED_COOKIE, '1', {
          maxAge: 300,
          path: '/',
        })
        return response
      } catch {
        // Fail-open: if settings fetch fails, allow through
      }
    }
  }

  // Protect account routes (except login) - redirect unauthenticated visitors
  const accountRouteMatch = pathname.match(/^\/([a-z]{2})\/account(\/.*)?$/)
  if (accountRouteMatch) {
    const locale = accountRouteMatch[1]
    const subPath = accountRouteMatch[2] || ''

    if (subPath !== '/login') {
      if (!request.cookies.has(VISITOR_COOKIE_NAME)) {
        const loginUrl = new URL(`/${locale}/account/login`, request.url)
        loginUrl.searchParams.set('returnTo', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  // Skip i18n for API routes, Next.js internals, static files, and
  // deep-link association files (apple-app-site-association, assetlinks.json)
  // which must be served at the apex domain without locale prefix.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/next') ||
    pathname.startsWith('/.well-known') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Apply i18n middleware for frontend routes
  const response = intlMiddleware(request)
  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and internals
    '/((?!_next|_vercel|.*\\..*).*)'
  ],
}
