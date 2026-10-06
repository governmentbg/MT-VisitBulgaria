'use client'

import React, { useState } from 'react'
import { Tooltip } from '@payloadcms/ui'
import { useLocalizationTranslation } from '@/plugins/localization-enhancement/ui/useLocalizationTranslation'

const baseClass = 'locale-action'

export const LocaleHelpIcon: React.FC = () => {
  const [show, setShow] = useState(false)
  const { tl } = useLocalizationTranslation()

  return (
    <span
      className={`${baseClass}__help`}
      tabIndex={0}
      role="note"
      aria-label={tl('localization:labels:localeHelpText')}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      ?
      <Tooltip show={show} position="bottom">
        {tl('localization:labels:localeHelpText')}
      </Tooltip>
    </span>
  )
}
