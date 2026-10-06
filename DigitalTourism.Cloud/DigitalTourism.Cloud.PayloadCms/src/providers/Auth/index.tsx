'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Visitor } from '@/payload-types'
import { createClientLogger } from '@/plugins/logging/client'

const logger = createClientLogger('auth-provider')

/**
 * Result of a direct authentication operation
 */
export interface AuthResult {
  success: boolean
  error?: string
  errorCode?: string
  visitor?: Visitor
}

/**
 * Data for user registration
 */
export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

/**
 * Auth context type with dialog state and direct auth methods
 */
interface AuthContextType {
  // Existing properties
  visitor: Visitor | null
  isLoading: boolean
  isAuthenticated: boolean
  /** Redirect-based login (backward compatible) */
  login: (redirectTo?: string) => void
  logout: () => Promise<void>
  refreshVisitor: () => Promise<void>

  // New dialog-based auth
  /** Opens the auth dialog */
  openAuthDialog: (view?: 'login' | 'register') => void
  /** Closes the auth dialog */
  closeAuthDialog: () => void
  /** Whether the auth dialog is open */
  isAuthDialogOpen: boolean
  /** Current view in the auth dialog */
  authDialogView: 'login' | 'register'
  /** Login with email/password */
  loginWithCredentials: (email: string, password: string) => Promise<AuthResult>
  /** Register a new account */
  register: (data: RegisterData) => Promise<AuthResult>
  /** Request a password reset email */
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [visitor, setVisitor] = useState<Visitor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Dialog state
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [authDialogView, setAuthDialogView] = useState<'login' | 'register'>('login')

  const fetchVisitor = useCallback(async () => {
    try {
      const response = await fetch('/api/visitors/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setVisitor(data.user || null)
      } else {
        setVisitor(null)
      }
    } catch (error) {
      logger.error('Failed to fetch visitor', { error: String(error) })
      setVisitor(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVisitor()
  }, [fetchVisitor])

  // Redirect-based login (backward compatible)
  const login = useCallback((redirectTo?: string) => {
    const params = new URLSearchParams()
    if (redirectTo) {
      params.set('redirect', redirectTo)
    }
    // Pass current page locale to Keycloak so the login page renders in the same language
    const pathLocale = window.location.pathname.split('/')[1]
    if (pathLocale && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathLocale)) {
      params.set('locale', pathLocale)
    }
    const queryString = params.toString()
    window.location.href = `/api/visitors/oauth/keycloak/authorize${queryString ? `?${queryString}` : ''}`
  }, [])

  const logout = useCallback(async () => {
    setVisitor(null)
    // Redirect to logout endpoint which clears cookies and ends Keycloak session
    window.location.href = '/api/visitors/logout'
  }, [])

  const refreshVisitor = useCallback(async () => {
    await fetchVisitor()
  }, [fetchVisitor])

  // Dialog controls
  const openAuthDialog = useCallback((view: 'login' | 'register' = 'login') => {
    setAuthDialogView(view)
    setIsAuthDialogOpen(true)
  }, [])

  const closeAuthDialog = useCallback(() => {
    setIsAuthDialogOpen(false)
  }, [])

  // Direct credential-based login
  const loginWithCredentials = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/visitors/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const result = await response.json()

      if (result.success && result.visitor) {
        setVisitor(result.visitor)
        setIsAuthDialogOpen(false)
        return { success: true, visitor: result.visitor }
      }

      return {
        success: false,
        error: result.error || 'Login failed',
        errorCode: result.errorCode,
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Service unavailable',
        errorCode: 'SERVICE_UNAVAILABLE',
      }
    }
  }, [])

  // Registration
  const register = useCallback(async (data: RegisterData): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/visitors/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      const result = await response.json()

      if (result.success && result.visitor) {
        setVisitor(result.visitor)
        setIsAuthDialogOpen(false)
        return { success: true, visitor: result.visitor }
      }

      return {
        success: false,
        error: result.error || 'Registration failed',
        errorCode: result.errorCode,
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: 'Service unavailable',
        errorCode: 'SERVICE_UNAVAILABLE',
      }
    }
  }, [])

  // Forgot password
  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      await fetch('/api/visitors/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      // Always succeeds to prevent email enumeration
    } catch (error) {
      console.error('Forgot password error:', error)
      // Still don't throw to prevent enumeration
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        visitor,
        isLoading,
        isAuthenticated: !!visitor,
        login,
        logout,
        refreshVisitor,
        openAuthDialog,
        closeAuthDialog,
        isAuthDialogOpen,
        authDialogView,
        loginWithCredentials,
        register,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for checking if user is authenticated (for protected routes)
export function useRequireAuth(redirectTo = '/account/login') {
  const { isAuthenticated, isLoading, login } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login(redirectTo)
    }
  }, [isAuthenticated, isLoading, login, redirectTo])

  return { isAuthenticated, isLoading }
}
