'use client'

import React, { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation.js'
import * as qs from 'qs-esm'
import {
  ConfirmationModal,
  useFormModified,
  useModal,
  useRouteTransition,
  useTranslation,
} from '@payloadcms/ui'
import { useLocaleLoading } from '@payloadcms/ui/providers/Locale'

const MODAL_SLUG = 'confirm-locale-switch'

/**
 * Shared hook for switching the active locale via URL query param.
 * Used by both the header Localizer and the document-level LocaleIndicator.
 *
 * When used inside a Form context (e.g. document edit page), it checks for
 * unsaved changes and shows Payload's standard confirmation modal.
 * Outside a Form context (e.g. header), `useFormModified` returns `false`
 * (its default) so no prompt is shown.
 *
 * Returns `{ switchLocale, confirmModal }` — consumers must render `confirmModal`
 * in their JSX tree.
 */
export function useLocaleSwitch() {
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()
  const { setLocaleIsLoading } = useLocaleLoading()
  const modified = useFormModified()
  const { t } = useTranslation()
  const { openModal } = useModal()
  const pendingLocaleRef = useRef<string | null>(null)

  const doSwitch = useCallback(
    (localeCode: string) => {
      setLocaleIsLoading(true)

      const searchParams = new URLSearchParams(window.location.search)
      const url = qs.stringify(
        {
          ...qs.parse(searchParams.toString(), {
            depth: 10,
            ignoreQueryPrefix: true,
          }),
          locale: localeCode,
        },
        { addQueryPrefix: true },
      )

      startRouteTransition(() => {
        router.push(url)
      })
    },
    [router, setLocaleIsLoading, startRouteTransition],
  )

  const switchLocale = useCallback(
    (localeCode: string) => {
      if (modified) {
        pendingLocaleRef.current = localeCode
        openModal(MODAL_SLUG)
        return
      }
      doSwitch(localeCode)
    },
    [modified, openModal, doSwitch],
  )

  const handleConfirm = useCallback(() => {
    if (pendingLocaleRef.current) {
      doSwitch(pendingLocaleRef.current)
      pendingLocaleRef.current = null
    }
  }, [doSwitch])

  // Always render the modal — Payload's useModal handles visibility internally
  // via openModal/closeModal. Conditional mount/unmount can cause focus issues.
  const confirmModal = (
    <ConfirmationModal
      modalSlug={MODAL_SLUG}
      heading={t('general:leaveWithoutSaving')}
      body={t('general:changesNotSaved')}
      cancelLabel={t('general:stayOnThisPage')}
      confirmLabel={t('general:leaveAnyway')}
      onConfirm={handleConfirm}
    />
  )

  return { switchLocale, confirmModal }
}
