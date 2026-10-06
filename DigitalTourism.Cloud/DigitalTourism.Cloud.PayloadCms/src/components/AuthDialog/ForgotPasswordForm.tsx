/**
 * Forgot Password Form Component
 *
 * Form for requesting a password reset email.
 *
 * @module components/AuthDialog/ForgotPasswordForm
 */

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Loader2, AlertCircle, Mail } from 'lucide-react'
import { Button, Input, Label } from '@/components/ui'
import type { AuthFormProps, ForgotPasswordFormData } from './types'

/**
 * ForgotPasswordForm Component
 *
 * Allows users to request a password reset email.
 *
 * @param props - Component props
 */
export const ForgotPasswordForm: React.FC<AuthFormProps> = ({
  onViewChange,
  isLoading: externalLoading,
  setIsLoading: setExternalLoading,
}) => {
  const t = useTranslations('auth')
  const [internalLoading, setInternalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLoading = externalLoading ?? internalLoading
  const setIsLoading = setExternalLoading ?? setInternalLoading

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
  })

  /**
   * Handles form submission
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/visitors/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      // Always show success to prevent email enumeration
      if (result.success) {
        onViewChange?.('reset-sent')
      } else {
        // Only show error for validation issues
        if (result.errorCode === 'INVALID_EMAIL') {
          setError(t('errors.emailInvalid'))
        } else {
          // Still navigate to success view to prevent enumeration
          onViewChange?.('reset-sent')
        }
      }
    } catch (err) {
      console.error('[ForgotPasswordForm] Error:', err)
      // Still navigate to success view on network errors
      onViewChange?.('reset-sent')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 pt-4">
      {/* Back Button */}
      <button
        type="button"
        className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => onViewChange?.('login')}
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        {t('backToLogin')}
      </button>

      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Description */}
      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        {t('forgotPasswordDescription')}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="forgot-email" className="text-sm font-medium">
            {t('email')}
          </Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            disabled={isLoading}
            className="h-12 rounded-lg border-border/60 bg-muted/30 px-4 transition-colors focus:bg-background"
            {...register('email', {
              required: t('errors.emailRequired'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('errors.emailInvalid'),
              },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className="text-sm text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-12 w-full rounded-lg text-base font-semibold transition-all duration-200 hover:shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('sendingResetLink')}
            </>
          ) : (
            t('sendResetLink')
          )}
        </Button>
      </form>
    </div>
  )
}
