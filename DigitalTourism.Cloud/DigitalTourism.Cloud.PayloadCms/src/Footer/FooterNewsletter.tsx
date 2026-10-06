'use client'

import { Button, cn } from '@/components/ui'
import { useTranslations, useLocale } from 'next-intl'
import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'

type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error'

interface FooterNewsletterProps {
  className?: string
}

export const FooterNewsletter: React.FC<FooterNewsletterProps> = ({ className }) => {
  const t = useTranslations('footer')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<SubscribeStatus>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'loading') return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const isSuccess = status === 'success'

  return (
    <div className={cn('grid', className)}>
      {/* Both views occupy the same grid cell to prevent layout shift */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          'flex flex-col gap-3 transition-opacity duration-300 [grid-area:1/1]',
          isSuccess && 'pointer-events-none opacity-0',
        )}
      >
        <div className="relative flex items-center">
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="w-full rounded-full bg-white py-4 pl-6 pr-44 text-base font-sans italic text-grey-900 placeholder:text-grey-900/60 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
          />
          <Button
            type="submit"
            variant="primary"
            size="xs"
            className="absolute right-2 rounded-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </span>
            ) : (
              t('subscribe')
            )}
          </Button>
        </div>
        {status === 'error' ? (
          <p className="text-sm font-semibold leading-relaxed text-red-300">
            {t('subscribeError')}
          </p>
        ) : (
          <p className="text-sm font-semibold leading-relaxed text-white/80">
            {t('privacyConsent')}
          </p>
        )}
      </form>

      {/* Success view — same grid cell, fades in */}
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 transition-opacity duration-300 [grid-area:1/1]',
          isSuccess ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <CheckCircle className="h-10 w-10 text-green-400" strokeWidth={1.5} />
        <p className="text-lg font-bold text-white">{t('subscribeSuccess')}</p>
        <p className="text-sm text-white/80">{t('subscribeSuccessMessage')}</p>
      </div>
    </div>
  )
}
