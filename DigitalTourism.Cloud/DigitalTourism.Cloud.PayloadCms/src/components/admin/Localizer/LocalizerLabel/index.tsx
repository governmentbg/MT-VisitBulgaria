'use client'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import './index.scss'
import { ChevronIcon, useLocale, useTranslation } from '@payloadcms/ui'
import { useLocaleLoading } from '@payloadcms/ui/providers/Locale'

const baseClass = 'localizer-button'

export const LocalizerLabel: React.FC<{
  ariaLabel?: string
  className?: string
}> = (props) => {
  const { ariaLabel, className } = props
  const locale = useLocale()
  const { i18n, t } = useTranslation()

  const { localeIsLoading } = useLocaleLoading()
  return (
    <div
      aria-label={ariaLabel || t('general:locale')}
      className={[baseClass, className].filter(Boolean).join(' ')}
      data-locale={locale ? locale.code : undefined}
    >
      <div className={`${baseClass}__label`}>{`${t('general:locale')}:`}&nbsp;</div>
      <div className={`${baseClass}__current`}>
        <span className={`${baseClass}__current-label`}>
          {`${getTranslation(locale.label, i18n)}`} {localeIsLoading && `(${t('general:loading')})`}
        </span>
        <ChevronIcon className={`${baseClass}__chevron`} />
      </div>
    </div>
  )
}