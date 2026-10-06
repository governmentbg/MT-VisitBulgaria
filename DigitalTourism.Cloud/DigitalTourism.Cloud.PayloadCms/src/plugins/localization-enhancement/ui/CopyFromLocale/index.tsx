'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation.js'
import { getTranslation } from '@payloadcms/translations'
import { formatAdminURL } from 'payload/shared'
import { toast } from 'sonner'
import {
  Button,
  CheckboxField,
  Drawer,
  PopupList,
  SelectInput,
  useConfig,
  useDocumentInfo,
  useFormModified,
  useLocale,
  useModal,
  useRouteTransition,
  useServerFunctions,
  useTranslation,
  XIcon,
} from '@payloadcms/ui'
import type { LocaleCode } from '@/i18n/localization'
import { FLAG_COMPONENTS } from '@/i18n/localeUI'
import './index.scss'

const baseClass = 'copy-from-locale'
const drawerSlug = 'copy-from-locale'

export const CopyFromLocale: React.FC = () => {
  const {
    config: {
      localization,
      routes: { admin },
    },
  } = useConfig()
  const { code: currentLocaleCode } = useLocale()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const { i18n, t } = useTranslation()
  const modified = useFormModified()
  const { toggleModal } = useModal()
  const { copyDataFromLocale } = useServerFunctions()
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  const [copying, setCopying] = useState(false)
  const [fromLocale, setFromLocale] = useState<string | null>(null)
  const [overwriteExisting, setOverwriteExisting] = useState(false)

  const sourceLocaleOptions = localization
    ? localization.locales
        .filter((l) => l.code !== currentLocaleCode)
        .map((l) => ({ label: l.label, value: l.code }))
    : []

  const getLocaleLabel = useCallback(
    (code: string) => {
      const locale = localization ? localization.locales.find((l) => l.code === code) : undefined
      return locale?.label ? getTranslation(locale.label, i18n) : code
    },
    [i18n, localization],
  )

  const handleOpen = useCallback(() => {
    if (modified) {
      toast.info(t('general:unsavedChanges'))
    } else {
      toggleModal(drawerSlug)
    }
  }, [modified, t, toggleModal])

  const handleCopy = useCallback(async () => {
    if (!fromLocale || copying) return

    setCopying(true)
    try {
      await copyDataFromLocale({
        collectionSlug,
        docID: id,
        fromLocale,
        globalSlug,
        overrideData: overwriteExisting,
        toLocale: currentLocaleCode,
      })
      setCopying(false)
      startRouteTransition(() =>
        router.push(
          formatAdminURL({
            adminRoute: admin,
            path: `/${collectionSlug ? `collections/${collectionSlug}/${id}` : `globals/${globalSlug}`}`,
          }) + `?locale=${currentLocaleCode}`,
        ),
      )
      toggleModal(drawerSlug)
    } catch (error: unknown) {
      setCopying(false)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('error:unknown'))
      }
    }
  }, [
    fromLocale,
    copying,
    copyDataFromLocale,
    collectionSlug,
    id,
    globalSlug,
    overwriteExisting,
    currentLocaleCode,
    startRouteTransition,
    router,
    admin,
    toggleModal,
    t,
  ])

  if (!id && !globalSlug) return null

  const currentLocaleLabel = getLocaleLabel(currentLocaleCode)
  const fromLocaleLabel = fromLocale ? getLocaleLabel(fromLocale) : null
  const SourceFlag = fromLocale ? FLAG_COMPONENTS[fromLocale as LocaleCode] : null

  return (
    <>
      <PopupList.Button id={`${baseClass}__button`} onClick={handleOpen}>
        {t('localization:copyFromLocale' as any)}
      </PopupList.Button>
      <Drawer
        className={baseClass}
        gutter={false}
        Header={
          <div className={`${baseClass}__header`}>
            <h2>{t('localization:copyFromLocale' as any)}</h2>
            <button
              aria-label={t('general:close')}
              className="drawer-close-button"
              type="button"
              onClick={() => toggleModal(drawerSlug)}
            >
              <XIcon />
            </button>
          </div>
        }
        slug={drawerSlug}
      >
        <div className={`${baseClass}__sub-header`}>
          <span>
            {fromLocale ? (
              <div className={`${baseClass}__description`}>
                {SourceFlag && <SourceFlag className={`${baseClass}__description-flag`} />}
                {t('localization:copyFromDescription' as any, {
                  source: fromLocaleLabel,
                  target: currentLocaleLabel,
                })}
              </div>
            ) : (
              t('localization:selectSourceLocale' as any)
            )}
          </span>
          <Button
            buttonStyle="primary"
            disabled={!fromLocale}
            iconPosition="left"
            onClick={handleCopy}
            size="medium"
          >
            {copying ? t('general:copying') + '...' : t('general:copy')}
          </Button>
        </div>
        <div className={`${baseClass}__content`}>
          <SelectInput
            label={t('localization:copyFrom' as any)}
            name="fromLocale"
            onChange={(selectedOption) => {
              if (!Array.isArray(selectedOption) && selectedOption?.value) {
                setFromLocale(selectedOption.value as string)
              }
            }}
            options={sourceLocaleOptions}
            path="fromLocale"
            value={fromLocale ?? ''}
          />
          <CheckboxField
            checked={overwriteExisting}
            field={{
              name: 'overwriteExisting',
              label: t('general:overwriteExistingData'),
            }}
            onChange={() => setOverwriteExisting(!overwriteExisting)}
            path="overwriteExisting"
          />
        </div>
      </Drawer>
    </>
  )
}
