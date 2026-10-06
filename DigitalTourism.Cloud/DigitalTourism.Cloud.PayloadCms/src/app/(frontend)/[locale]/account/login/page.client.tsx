'use client'

import { useEffect } from 'react'
import { useAuth } from '@/providers/Auth'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPageClient() {
  const { visitor, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo')

  useEffect(() => {
    // If already logged in, redirect to the original page or account page
    if (!isLoading && visitor) {
      router.replace(returnTo || '/account')
      return
    }

    // Auto-redirect to OAuth provider with redirect param
    if (!isLoading && !visitor) {
      const params = new URLSearchParams()
      if (returnTo) {
        params.set('redirect', returnTo)
      }
      // Pass current page locale to Keycloak
      const pathLocale = window.location.pathname.split('/')[1]
      if (pathLocale && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathLocale)) {
        params.set('locale', pathLocale)
      }
      const queryString = params.toString()
      window.location.href = `/api/visitors/oauth/keycloak/authorize${queryString ? `?${queryString}` : ''}`
    }
  }, [isLoading, visitor, router, returnTo])

  // Show loading state while checking auth or redirecting
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
      </div>
      <p className="mt-8 text-muted-foreground">Redirecting to login...</p>
    </div>
  )
}
