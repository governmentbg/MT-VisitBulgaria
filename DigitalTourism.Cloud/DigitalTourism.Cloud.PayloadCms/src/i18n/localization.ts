import type { Config } from '@/payload-types'

/**
 * Centralized localization configuration
 * This is the single source of truth for all locale settings in the application
 */

export const LOCALE_CODES = ['en', 'bg', 'de', 'fr', 'ru'] as const

export type LocaleCode = (typeof LOCALE_CODES)[number]

export const DEFAULT_LOCALE: LocaleCode = 'en'

/**
 * Full locale configuration with labels for Payload CMS
 */
export const localeConfig = LOCALE_CODES.map((code) => ({
  code,
  label: getLocaleLabel(code),
  fallbackLocale: DEFAULT_LOCALE,
}))

function getLocaleLabel(code: LocaleCode): string {
  const labels: Record<LocaleCode, string> = {
    en: 'English',
    bg: 'Български',
    de: 'Deutsch',
    fr: 'Français',
    ru: 'Русский',
  }
  return labels[code]
}

/**
 * Localization config object for Payload CMS
 */
const localization = {
  defaultLocale: DEFAULT_LOCALE,
  locales: localeConfig,
  fallback: true,
} as const

export default localization

// Type for Payload locale parameter - matches the Config['locale'] type
export type PayloadLocale = Config['locale']

// Helper to validate and cast a string to PayloadLocale
export function toPayloadLocale(locale: string): PayloadLocale {
  if (LOCALE_CODES.includes(locale as LocaleCode)) {
    return locale as PayloadLocale
  }
  return DEFAULT_LOCALE
}

// Helper to check if a string is a valid locale
export function isValidLocale(locale: string): locale is LocaleCode {
  return LOCALE_CODES.includes(locale as LocaleCode)
}
