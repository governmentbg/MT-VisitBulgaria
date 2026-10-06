/**
 * Register Form Component
 *
 * Registration form with email/password fields, validation, and error handling.
 * Follows the minimal friction design with just email and password.
 *
 * @module components/AuthDialog/RegisterForm
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button, Input, FormField } from '@/components/ui'
import { SocialLoginButtons } from './SocialLoginButtons'
import type { AuthFormProps, RegisterFormData, AuthResult } from './types'

/**
 * RegisterForm Component
 *
 * Provides registration with email/password and social login options.
 *
 * @param props - Component props
 */
export const RegisterForm: React.FC<AuthFormProps> = ({
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
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  /**
   * Handles form submission
   */
  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/visitors/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
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
      console.error('[RegisterForm] Error:', err)
      setError(t('errors.serviceUnavailable'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Register Form */}
      <div className="flex flex-col gap-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-error-25 bg-error-0 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-error-100" />
              <p className="text-body-sm text-error-100">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Email Field */}
            <FormField label={t('email')} name="register-email" error={errors.email?.message}>
              <Input
                id="register-email"
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
              <FormField label={t('password')} name="register-password" error={errors.password?.message}>
                <Input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  autoComplete="new-password"
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
                    minLength: {
                      value: 8,
                      message: t('errors.passwordTooShort'),
                    },
                  })}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
              </FormField>
              <p className="text-xs font-medium text-error-100">{t('passwordRequirements')}</p>
            </div>

            {/* Confirm Password Field */}
            <FormField label={t('confirmPassword')} name="register-confirm-password" error={errors.confirmPassword?.message}>
              <Input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('confirmPasswordPlaceholder')}
                autoComplete="new-password"
                disabled={isLoading}
                {...register('confirmPassword', {
                  required: t('errors.confirmPasswordRequired'),
                  validate: (value) => value === password || t('errors.passwordsDoNotMatch'),
                })}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
            </FormField>
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
                {t('creatingAccount')}
              </>
            ) : (
              t('createAccount')
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-0">
          <div className="h-px flex-1 bg-grey-100" />
          <span className="bg-white px-2.5 text-body-sm text-grey-500">
            {t('orContinueWith')}
          </span>
          <div className="h-px flex-1 bg-grey-100" />
        </div>
      </div>

      {/* Social Login Buttons */}
      <SocialLoginButtons disabled={isLoading} />

      {/* Login Link */}
      <div className="flex items-center justify-center gap-2.5">
        <p className="text-xs font-medium text-grey-600">
          {t('haveAccount')}
        </p>
        <button
          type="button"
          className="text-xs font-semibold text-primary-700 underline transition-colors hover:text-primary-600"
          onClick={() => onViewChange?.('login')}
        >
          {t('signIn')}
        </button>
      </div>
    </div>
  )
}

/**
 * Maps error codes to translated user-friendly messages
 */
function getErrorMessage(errorCode: string, t: (key: string) => string): string {
  const errorMap: Record<string, string> = {
    EMAIL_EXISTS: t('errors.emailExists'),
    INVALID_EMAIL: t('errors.emailInvalid'),
    WEAK_PASSWORD: t('errors.weakPassword'),
    SERVICE_UNAVAILABLE: t('errors.serviceUnavailable'),
  }
  return errorMap[errorCode] || t('errors.unknownError')
}
