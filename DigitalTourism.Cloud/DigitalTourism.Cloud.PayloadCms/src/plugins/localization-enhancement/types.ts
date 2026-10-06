import type { LocaleCode } from '@/i18n/localization'

export const TRANSLATION_STATUS_FIELD = '_translationStatus'
export const TRANSLATIONS_COLUMN_FIELD = '_translationsColumn'

export type TranslationStatus = 'complete' | 'partial' | 'missing'

export interface TranslationStatusEntry {
  status: TranslationStatus
  translated: number
  total: number
}

export type TranslationStatusMap = Record<LocaleCode, TranslationStatusEntry>

export interface LocalizationEnhancementConfig {
  /** Collection slugs to exclude from localization enhancement */
  exclude?: string[]
  /** Whether to append the translations column to admin.defaultColumns (default: true) */
  addToDefaultColumns?: boolean
}
