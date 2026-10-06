import { Link } from '@/i18n/routing'
import React from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui'

export default function NotFound() {
  const t = useTranslations('errors')
  const tCommon = useTranslations('common')

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{t('pageNotFound')}</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">{tCommon('backToHome')}</Link>
      </Button>
    </div>
  )
}
