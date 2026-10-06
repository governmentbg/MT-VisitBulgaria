/**
 * Reset Sent View Component
 *
 * Confirmation view shown after a password reset email has been requested.
 *
 * @module components/AuthDialog/ResetSentView
 */

'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, ArrowLeft, Inbox, Clock } from 'lucide-react'
import { Button } from '@/components/ui'
import type { AuthDialogView } from './types'

/**
 * Props for the ResetSentView component
 */
interface ResetSentViewProps {
  /** Callback to switch to a different view */
  onViewChange?: (view: AuthDialogView) => void
}

/**
 * ResetSentView Component
 *
 * Shows a confirmation message after password reset email is sent.
 *
 * @param props - Component props
 */
export const ResetSentView: React.FC<ResetSentViewProps> = ({ onViewChange }) => {
  const t = useTranslations('auth')

  return (
    <div className="space-y-6 pt-4 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{t('resetEmailSent')}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t('resetEmailSentDescription')}
        </p>
      </div>

      {/* Instructions */}
      <div className="mx-auto max-w-sm space-y-3 rounded-xl bg-muted/40 p-5">
        <p className="text-sm font-medium text-foreground">{t('resetEmailInstructions')}</p>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 text-left text-sm text-muted-foreground">
            <Inbox className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{t('resetEmailCheckSpam')}</span>
          </div>
          <div className="flex items-start gap-3 text-left text-sm text-muted-foreground">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{t('resetEmailExpiry')}</span>
          </div>
        </div>
      </div>

      {/* Back to Login Button */}
      <Button
        variant="outline"
        className="h-12 w-full rounded-lg font-semibold transition-all duration-200 hover:bg-muted"
        onClick={() => onViewChange?.('login')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('backToLogin')}
      </Button>
    </div>
  )
}
