/**
 * Auth Dialog Component
 *
 * Main authentication dialog that manages state and renders
 * the appropriate form based on the current view.
 *
 * @module components/AuthDialog
 *
 * @example
 * ```tsx
 * <AuthDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   defaultView="login"
 *   onSuccess={(visitor) => console.log('Logged in:', visitor)}
 * />
 * ```
 */

'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  CloseButton,
  cn,
} from '@/components/ui'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { ResetSentView } from './ResetSentView'
import type { AuthDialogView } from './types'
import type { Visitor } from '@/payload-types'

/**
 * Props for the AuthDialog component
 */
export interface AuthDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when the open state changes */
  onOpenChange: (open: boolean) => void
  /** Initial view to show */
  defaultView?: 'login' | 'register'
  /** Callback when authentication succeeds */
  onSuccess?: (visitor: Visitor) => void
}

/**
 * View configuration for titles and descriptions
 */
interface ViewConfig {
  title: string
  description: string
}

/**
 * AuthDialog Component
 *
 * Provides a modal dialog for login, registration, and password reset flows.
 * Manages internal view state and coordinates between form components.
 *
 * @param props - Component props
 */
export const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
  defaultView = 'login',
  onSuccess,
}) => {
  const t = useTranslations('auth')
  const [view, setView] = useState<AuthDialogView>(defaultView)
  const [isLoading, setIsLoading] = useState(false)

  // Reset view when dialog opens
  useEffect(() => {
    if (open) {
      setView(defaultView)
    }
  }, [open, defaultView])

  /**
   * Handles successful authentication
   */
  const handleSuccess = useCallback(
    (visitor: Visitor) => {
      onOpenChange(false)
      onSuccess?.(visitor)
    },
    [onOpenChange, onSuccess],
  )

  /**
   * Handles view changes
   */
  const handleViewChange = useCallback((newView: AuthDialogView) => {
    setView(newView)
  }, [])

  /**
   * Gets configuration for the current view
   */
  const getViewConfig = (): ViewConfig => {
    switch (view) {
      case 'login':
        return {
          title: t('signInTitle'),
          description: t('signInDescription'),
        }
      case 'register':
        return {
          title: t('createAccountTitle'),
          description: t('createAccountDescription'),
        }
      case 'forgot-password':
        return {
          title: t('resetPasswordTitle'),
          description: t('resetPasswordDescription'),
        }
      case 'reset-sent':
        return {
          title: t('checkYourEmail'),
          description: '',
        }
    }
  }

  const config = getViewConfig()

  /**
   * Renders the current view's form
   */
  const renderView = () => {
    const commonProps = {
      onSuccess: handleSuccess,
      onViewChange: handleViewChange,
      isLoading,
      setIsLoading,
    }

    switch (view) {
      case 'login':
        return <LoginForm {...commonProps} />
      case 'register':
        return <RegisterForm {...commonProps} />
      case 'forgot-password':
        return <ForgotPasswordForm {...commonProps} />
      case 'reset-sent':
        return <ResetSentView onViewChange={handleViewChange} />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className={cn(
          // Mobile: fullscreen, no animations
          'inset-0 translate-x-0 translate-y-0 max-w-none rounded-none',
          'p-4 sm:p-6 gap-0 flex items-start overflow-y-auto overscroll-contain border-none',
          'duration-0',
          // Desktop (md+): floating centered popup
          'md:inset-auto md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%]',
          'md:max-w-[448px] md:max-h-[90dvh] md:rounded-[30px] md:p-8 md:shadow-2xl md:grid',
        )}
      >
        <div className="flex flex-col gap-6 sm:gap-4 md:gap-8 m-auto w-full max-w-[448px] sm:max-w-[700px] md:max-w-none">
          <div className="flex items-start gap-2">
            <DialogHeader className="flex-1 space-y-1">
              <DialogTitle className="text-xl font-bold font-heading leading-[1.3] text-grey-900">
                {config.title}
              </DialogTitle>
              {config.description && (
                <DialogDescription className="text-body-sm text-grey-500">
                  {config.description}
                </DialogDescription>
              )}
            </DialogHeader>
            <DialogPrimitive.Close asChild>
              <CloseButton size="md" className="shrink-0" />
            </DialogPrimitive.Close>
          </div>
          <div>{renderView()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Re-export types for convenience
export type { AuthDialogView }
export type { AuthFormProps, LoginFormData, RegisterFormData, ForgotPasswordFormData } from './types'
