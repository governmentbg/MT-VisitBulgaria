'use client'

import React from 'react'
import { useAuth, useTheme, useTranslation, Gutter, SetStepNav } from '@payloadcms/ui'
import type { User } from '@/payload-types'
import type { CustomTranslationsObject, CustomTranslationsKeys } from '@/i18n/custom-translations'
import { userLabels } from '@/i18n/admin/fields/users'
import { userRoleOptions } from '@/i18n/admin/options'
import './index.scss'

const baseClass = 'account-view'

export const AccountView: React.FC = () => {
  const { user } = useAuth<User>()
  const { theme, setTheme, autoMode } = useTheme()
  const { i18n, t, switchLanguage, languageOptions } = useTranslation<
    CustomTranslationsObject,
    CustomTranslationsKeys
  >()

  if (!user) return null

  const lang = (i18n.language as 'en' | 'bg') || 'en'

  const roleMap = Object.fromEntries(
    userRoleOptions.map((opt) => [opt.value, opt.label[lang] || opt.label.en]),
  )

  const currentThemePref = autoMode ? 'auto' : theme

  return (
    <main className={baseClass}>
      <SetStepNav nav={[{ label: t('authentication:account') }]} />
      <Gutter className={`${baseClass}__content`}>
        <div className="doc-header__header">
          <h1 className="doc-header__title render-title" title={t('authentication:account')}>
            {t('authentication:account')}
          </h1>
        </div>
        {/* Profile section */}
        <section className={`${baseClass}__section`}>
          <h3 className={`${baseClass}__section-title`}>{t('authentication:account')}</h3>

          <div className={`${baseClass}__field`}>
            <label className={`${baseClass}__label`}>{userLabels.name[lang]}</label>
            <input className={`${baseClass}__input`} type="text" value={[user.firstName, user.lastName].filter(Boolean).join(' ')} readOnly />
          </div>

          <div className={`${baseClass}__field`}>
            <label className={`${baseClass}__label`}>{userLabels.email[lang]}</label>
            <input
              className={`${baseClass}__input`}
              type="text"
              value={user.email || ''}
              readOnly
            />
          </div>

          <div className={`${baseClass}__field`}>
            <label className={`${baseClass}__label`}>{userLabels.roles[lang]}</label>
            <div className={`${baseClass}__pills`}>
              {user.roles?.length ? (
                user.roles.map((role) => (
                  <span key={role} className={`${baseClass}__pill`}>
                    {roleMap[role] || role}
                  </span>
                ))
              ) : (
                <span className={`${baseClass}__empty`}>—</span>
              )}
            </div>
          </div>
        </section>

        {/* Preferences section */}
        <section className={`${baseClass}__section`}>
          <h3 className={`${baseClass}__section-title`}>{t('general:userPreferences')}</h3>

          <div className={`${baseClass}__field`}>
            <label className={`${baseClass}__label`}>{t('general:adminTheme')}</label>
            <div className={`${baseClass}__button-group`}>
              {(
                [
                  { value: 'auto', label: t('general:automatic') },
                  { value: 'light', label: t('general:light') },
                  { value: 'dark', label: t('general:dark') },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={[
                    `${baseClass}__theme-btn`,
                    currentThemePref === option.value && `${baseClass}__theme-btn--active`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setTheme(option.value as Parameters<typeof setTheme>[0])}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {switchLanguage && languageOptions && (
            <div className={`${baseClass}__field`}>
              <label className={`${baseClass}__label`}>{t('general:language')}</label>
              <select
                className={`${baseClass}__select`}
                value={i18n.language}
                onChange={(e) =>
                  switchLanguage(e.target.value as Parameters<typeof switchLanguage>[0])
                }
              >
                {(Array.isArray(languageOptions)
                  ? languageOptions
                  : Object.entries(languageOptions).map(([value, label]) => ({ value, label: String(label) }))
                ).map((opt: { label: string; value: string }) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>
      </Gutter>
    </main>
  )
}

export default AccountView
