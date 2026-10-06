/**
 * Login Form Component
 *
 * Email/password login form with validation and error handling.
 *
 * @module components/AuthDialog/LoginForm
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button, Input, FormField } from '@/components/ui'
import { SocialLoginButtons } from './SocialLoginButtons'
import type { AuthFormProps, LoginFormData, AuthResult } from './types'

/**
 * LoginForm Component
 *
 * Provides email/password authentication with social login options.
 *
 * @param props - Component props
 */
export const LoginForm: React.FC<AuthFormProps> = ({
  onSuccess,
  onViewChange,
  isLoading: externalLoading,
  setIsLoading: setExternalLoading,
}) => {
  const t = useTranslations('auth')
  const [showPassword, setShowPassword] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLoading = externalLoading ?? internalLoading
  const setIsLoading = setExternalLoading ?? setInternalLoading

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  /**
   * Handles form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/visitors/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        credentials: 'include',
      })

      const result: AuthResult = await response.json()

      if (result.success && result.visitor) {
        onSuccess?.(result.visitor)
      } else {
        const errorMessage = getErrorMessage(result.errorCode || 'UNKNOWN_ERROR', t)
        setError(errorMessage)
      }
    } catch (err) {
      console.error('[LoginForm] Error:', err)
      setError(t('errors.serviceUnavailable'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:gap-6 md:flex-col md:gap-8">
      {/* Left column: Login Form */}
      <div className="flex flex-col gap-8 sm:flex-1 sm:gap-4 md:flex-auto md:gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 sm:gap-4 md:gap-8">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-error-25 bg-error-0 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-error-100" />
              <p className="text-body-sm text-error-100">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Email Field */}
            <FormField label={t('email')} name="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                disabled={isLoading}
                {...register('email', {
                  required: t('errors.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('errors.emailInvalid'),
                  },
                })}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
            </FormField>

            {/* Password Field */}
            <div className="flex flex-col gap-3">
              <FormField label={t('password')} name="password" error={errors.password?.message}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  autoComplete="current-password"
                  disabled={isLoading}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                      className="text-grey-400 hover:text-grey-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...register('password', {
                    required: t('errors.passwordRequired'),
                  })}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
              </FormField>
              <button
                type="button"
                className="self-end text-xs font-medium text-primary underline transition-colors hover:text-primary-600"
                onClick={() => onViewChange?.('forgot-password')}
              >
                {t('forgotPassword')}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="xs"
            icon={null}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('signingIn')}
              </>
            ) : (
              t('signIn')
            )}
          </Button>
        </form>
      </div>

      {/* Divider — horizontal on portrait, vertical on landscape, horizontal on desktop */}
      <div className="flex items-center gap-0 sm:flex-col sm:py-4 md:flex-row md:py-0">
        <div className="h-px flex-1 bg-grey-100 sm:h-auto sm:w-px sm:flex-1 md:h-px md:w-auto md:flex-1" />
        <span className="bg-white px-2.5 text-body-sm text-grey-500 sm:hidden md:inline">
          {t('orContinueWith')}
        </span>
        <div className="h-px flex-1 bg-grey-100 sm:h-auto sm:w-px sm:flex-1 md:h-px md:w-auto md:flex-1" />
      </div>

      {/* Right column: Social + Register */}
      <div className="flex flex-col gap-8 sm:flex-1 sm:gap-4 sm:justify-center md:flex-auto md:gap-8 md:justify-start">
        <SocialLoginButtons disabled={isLoading} />

        {/* Register Link */}
        <div className="flex items-center justify-center gap-2.5">
          <p className="text-xs font-medium text-grey-600">
            {t('noAccount')}
          </p>
          <button
            type="button"
            className="text-xs font-semibold text-primary-700 underline transition-colors hover:text-primary-600"
            onClick={() => onViewChange?.('register')}
          >
            {t('createAccount')}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Maps error codes to translated user-friendly messages
 */
function getErrorMessage(errorCode: string, t: (key: string) => string): string {
  const errorMap: Record<string, string> = {
    INVALID_CREDENTIALS: t('errors.invalidCredentials'),
    USER_DISABLED: t('errors.userDisabled'),
    USER_NOT_FOUND: t('errors.invalidCredentials'),
    INVALID_EMAIL: t('errors.emailInvalid'),
    SERVICE_UNAVAILABLE: t('errors.serviceUnavailable'),
  }
  return errorMap[errorCode] || t('errors.unknownError')
}
