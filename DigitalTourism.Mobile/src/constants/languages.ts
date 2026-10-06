/**
 * Language configuration constants
 * 
 * Supported languages and locale codes for internationalization.
 */
export const LANGUAGES = {
  en: 'en',
  bg: 'bg',
  de: 'de',
  ru: 'ru',
  fr: 'fr',
} as const;

export const LANGUAGE_NAMES = {
  [LANGUAGES.en]: 'English',
  [LANGUAGES.bg]: '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438',
  [LANGUAGES.de]: 'Deutsch',
  [LANGUAGES.ru]: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
  [LANGUAGES.fr]: 'Fran\u00e7ais',
} as const;

export const DEFAULT_LANGUAGE = LANGUAGES.en;

export const BUNDLED_LANGUAGES = [
  LANGUAGES.en,
  LANGUAGES.bg,
  LANGUAGES.de,
  LANGUAGES.ru,
  LANGUAGES.fr,
] as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];
export type BundledLanguage = typeof BUNDLED_LANGUAGES[number];
