'use client'
import { getTranslation } from '@payloadcms/translations'
import React, { useEffect, useState } from 'react'
import { useConfig, useTranslation, Popup, PopupList, useLocale } from '@payloadcms/ui'
import type { LocaleCode } from '@/i18n/localization'
import { FLAG_COMPONENTS } from '@/i18n/localeUI'
import { useLocaleSwitch } from '@/plugins/localization-enhancement/ui/useLocaleSwitch'
import { LocaleHelpIcon } from './LocaleHelpIcon'

import './index.scss'

const baseClass = 'locale-action'

export const Localizer: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props
  const {
    config: { localization },
  } = useConfig()

  const { i18n } = useTranslation()
  const locale = useLocale()
  const { switchLocale, confirmModal } = useLocaleSwitch()

  // Hide when the document-level LocaleIndicator is present
  const [hasDocSwitcher, setHasDocSwitcher] = useState(false)
  useEffect(() => {
    const el = document.documentElement
    const check = () => setHasDocSwitcher(el.hasAttribute('data-doc-locale-switcher'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(el, { attributes: true, attributeFilter: ['data-doc-locale-switcher'] })
    return () => observer.disconnect()
  }, [])

  if (!localization || hasDocSwitcher) return null

  const { locales } = localization
  const CurrentFlag = FLAG_COMPONENTS[locale.code as LocaleCode]
  const currentLabel = getTranslation(locale.label, i18n)

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')}>
      <LocaleHelpIcon />
      <Popup
        button={
          <div className={`${baseClass}__button`}>
            {CurrentFlag && <CurrentFlag className={`${baseClass}__flag`} />}
            <span className={`${baseClass}__current`}>{currentLabel}</span>
          </div>
        }
        horizontalAlign="right"
        render={({ close }) => (
          <PopupList.ButtonGroup>
            {locales.map((localeOption) => {
              const label = getTranslation(localeOption.label, i18n)
              const Flag = FLAG_COMPONENTS[localeOption.code as LocaleCode]
              return (
                <PopupList.Button
                  key={localeOption.code}
                  active={locale.code === localeOption.code}
                  disabled={locale.code === localeOption.code}
                  onClick={() => {
                    close()
                    switchLocale(localeOption.code)
                  }}
                >
                  <span className={`${baseClass}__option`}>
                    {Flag && <Flag className={`${baseClass}__option-flag`} />}
                    {label !== localeOption.code ? (
                      <>
                        {label}&nbsp;
                        <span className={`${baseClass}__code`}>({localeOption.code})</span>
                      </>
                    ) : (
                      <span className={`${baseClass}__code`}>{label}</span>
                    )}
                  </span>
                </PopupList.Button>
              )
            })}
          </PopupList.ButtonGroup>
        )}
        showScrollbar
        size="large"
      />
      {confirmModal}
    </div>
  )
}
