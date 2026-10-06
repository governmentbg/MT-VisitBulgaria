/**
 * Localization Translation Hook
 *
 * Provides typed access to localization-plugin-specific translations.
 * Uses the i18n object from Payload's useTranslation hook which
 * allows custom translation keys without strict type checking.
 *
 * Follows the same pattern as useWorkflowTranslation.
 */

import { useTranslation } from '@payloadcms/ui'

/**
 * All localization plugin translation keys
 */
export type LocalizationTranslationKey =
  // Labels
  | 'localization:labels:translations'
  | 'localization:labels:translationStatus'
  | 'localization:labels:complete'
  | 'localization:labels:partial'
  | 'localization:labels:missing'
  | 'localization:labels:fieldsTranslated'
  | 'localization:labels:noData'
  | 'localization:labels:clickToEdit'
  | 'localization:labels:localeHelpText'
  // Copy from locale
  | 'localization:copyFromLocale'
  | 'localization:selectSourceLocale'
  | 'localization:copyFromDescription'
  // Modal
  | 'localization:modal:unsavedChangesTitle'
  | 'localization:modal:unsavedChangesMessage'
  | 'localization:modal:stayOnPage'
  | 'localization:modal:discardAndSwitch'

/**
 * Hook for accessing localization translations
 *
 * Uses Payload's i18n object which accepts any string key,
 * but provides TypeScript autocomplete for known localization keys.
 *
 * @example
 * const { tl } = useLocalizationTranslation()
 * const label = tl('localization:labels:localeHelpText')
 */
export function useLocalizationTranslation() {
  const { i18n } = useTranslation()

  const tl = (key: LocalizationTranslationKey, options?: Record<string, unknown>): string => {
    return i18n.t(key as any, options) as string
  }

  return { tl, i18n }
}
