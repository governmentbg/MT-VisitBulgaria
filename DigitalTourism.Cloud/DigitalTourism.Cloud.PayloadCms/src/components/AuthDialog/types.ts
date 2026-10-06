/**
 * Type definitions for the AuthDialog components
 *
 * @module components/AuthDialog/types
 */

import type { Visitor } from '@/payload-types'

/**
 * Possible views/states for the auth dialog
 */
export type AuthDialogView = 'login' | 'register' | 'forgot-password' | 'reset-sent'

/**
 * Result of an authentication operation
 */
export interface AuthResult {
  success: boolean
  error?: string
  errorCode?: string
  visitor?: Visitor
}

/**
 * Login form data
 */
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Registration form data
 */
export interface RegisterFormData {
  email: string
  password: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
}

/**
 * Forgot password form data
 */
export interface ForgotPasswordFormData {
  email: string
}

/**
 * Social login provider types
 */
export type SocialProvider = 'google' | 'facebook' | 'apple'

/**
 * Form error state
 */
export interface FormError {
  message: string
  field?: string
}

/**
 * Props shared by all auth form components
 */
export interface AuthFormProps {
  /** Callback when authentication succeeds */
  onSuccess?: (visitor: Visitor) => void
  /** Callback to switch to a different view */
  onViewChange?: (view: AuthDialogView) => void
  /** Whether the form is in a loading/submitting state */
  isLoading?: boolean
  /** Set loading state */
  setIsLoading?: (loading: boolean) => void
}

/**
 * Props for the SocialLoginButtons component
 */
export interface SocialLoginButtonsProps {
  /** Callback when social login is initiated */
  onSocialLogin?: (provider: SocialProvider) => void
  /** Whether buttons should be disabled */
  disabled?: boolean
}
