'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { useRouter } from 'next/navigation.js'
import type { TranslationStatusMap, TranslationStatusEntry } from '../../types'
import { TRANSLATION_STATUS_FIELD } from '../../types'
import { FLAG_COMPONENTS, LOCALE_LABELS, LOCALE_ORDER } from '@/i18n/localeUI'
import { useLocalizationTranslation } from '../useLocalizationTranslation'
import './index.scss'

const baseClass = 'translation-status-cell'

export const TranslationStatusCell: React.FC<DefaultCellComponentProps> = ({
  rowData,
  collectionSlug,
}) => {
  const router = useRouter()
  const { tl } = useLocalizationTranslation()
  const statusMap = rowData?.[TRANSLATION_STATUS_FIELD] as TranslationStatusMap | undefined
  const docId = rowData?.id

  if (!statusMap) {
    return <div className={baseClass}>—</div>
  }

  return (
    <div className={baseClass}>
      {LOCALE_ORDER.map((locale) => {
        const entry: TranslationStatusEntry | undefined = statusMap[locale]
        const Flag = FLAG_COMPONENTS[locale]
        const label = LOCALE_LABELS[locale]

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
        const tooltipText = `${label}: ${statusText}`

        const statusClass = entry ? entry.status : 'missing'

        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation()
          if (docId && collectionSlug) {
            router.push(
              `/admin/collections/${collectionSlug}/${docId}?locale=${locale}`,
            )
          }
        }

        return (
          <button
            key={locale}
            type="button"
            className={`${baseClass}__flag ${baseClass}__flag--${statusClass}`}
            title={`${tooltipText} — ${tl('localization:labels:clickToEdit')}`}
            onClick={handleClick}
          >
            <Flag className={`${baseClass}__flag-icon`} />
            {entry && <span className={`${baseClass}__indicator`} />}
          </button>
        )
      })}
    </div>
  )
}
