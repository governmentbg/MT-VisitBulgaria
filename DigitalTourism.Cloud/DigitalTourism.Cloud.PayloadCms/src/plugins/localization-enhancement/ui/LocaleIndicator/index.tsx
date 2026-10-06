'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useConfig, useLocale, useForm } from '@payloadcms/ui'
import { FLAG_COMPONENTS, LOCALE_LABELS, LOCALE_ORDER } from '@/i18n/localeUI'
import type { TranslationStatusMap, TranslationStatusEntry } from '../../types'
import { TRANSLATION_STATUS_FIELD } from '../../types'
import { useLocalizationTranslation } from '../useLocalizationTranslation'
import { useLocaleSwitch } from '../useLocaleSwitch'
import './index.scss'

const baseClass = 'locale-switcher'

/**
 * Locale switcher rendered in the document controls bar.
 *
 * Displays all locale flags with translation-status indicators (like the
 * list-view column cell). Clicking a flag switches to that locale.
 *
 * Uses a React portal to place itself inside `.doc-controls__meta`.
 */
export const LocaleIndicator: React.FC = () => {
  const {
    config: { localization },
  } = useConfig()
  const locale = useLocale()
  const { switchLocale, confirmModal } = useLocaleSwitch()
  const { tl } = useLocalizationTranslation()
  const { getData } = useForm()
  const [metaContainer, setMetaContainer] = useState<Element | null>(null)

  // Find the .doc-controls__meta list to portal into
  useEffect(() => {
    const meta = document.querySelector('.doc-controls__meta')
    if (meta) {
      setMetaContainer(meta)
    }
  }, [])

  // Signal to the header Localizer that a document-level switcher is active
  useEffect(() => {
    document.documentElement.setAttribute('data-doc-locale-switcher', '')
    return () => document.documentElement.removeAttribute('data-doc-locale-switcher')
  }, [])

  if (!localization || !metaContainer) return null

  const formData = getData()
  const statusMap = formData?.[TRANSLATION_STATUS_FIELD] as TranslationStatusMap | undefined

  return createPortal(
    <li className={`doc-controls__list-item ${baseClass}`}>
      {confirmModal}
      <div className={`${baseClass}__flags`}>
        {LOCALE_ORDER.map((localeCode) => {
          const entry: TranslationStatusEntry | undefined = statusMap?.[localeCode]
          const Flag = FLAG_COMPONENTS[localeCode]
          const label = LOCALE_LABELS[localeCode]
          const isActive = locale.code === localeCode

          let statusText: string
          if (!entry) {
            statusText = tl('localization:labels:noData')
          } else if (entry.status === 'complete') {
            statusText = tl('localization:labels:complete')
          } else if (entry.status === 'partial') {
            const fields = tl('localization:labels:fieldsTranslated', { translated: entry.translated, total: entry.total })
            statusText = `${tl('localization:labels:partial')} (${fields})`
          } else {
            statusText = tl('localization:labels:missing')
          }

          const statusClass = entry ? entry.status : 'missing'

          return (
            <button
              key={localeCode}
              type="button"
              className={[
                `${baseClass}__flag`,
                `${baseClass}__flag--${statusClass}`,
                isActive ? `${baseClass}__flag--active` : '',
              ].filter(Boolean).join(' ')}
              title={`${label}: ${statusText}`}
              onClick={() => {
                if (!isActive) {
                  switchLocale(localeCode)
                }
              }}
              disabled={isActive}
            >
              <Flag className={`${baseClass}__flag-icon`} />
              {entry && <span className={`${baseClass}__indicator`} />}
            </button>
          )
        })}
      </div>
    </li>,
    metaContainer,
  )
}
