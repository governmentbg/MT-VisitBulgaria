/**
 * Language Detector for React Native
 *
 * Detects device language using react-native-localize
 * and persists user's language preference using MMKV.
 */

import { createMMKV } from 'react-native-mmkv';
import * as RNLocalize from 'react-native-localize';
import type { LanguageDetectorModule } from 'i18next';

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'bg', 'de', 'ru', 'fr'];
const FALLBACK_LANGUAGE = 'en';
const STORAGE_KEY = 'user-language';

// Create MMKV instance for i18n storage
const i18nStorage = createMMKV({ id: 'i18n-storage' });

/**
 * Detect the best language to use based on:
 * 1. Saved user preference (MMKV)
 * 2. Device locale (react-native-localize)
 * 3. Fallback to English
 */
function detectLanguage(): string {
  // Check saved preference
  const savedLanguage = i18nStorage.getString(STORAGE_KEY);
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    return savedLanguage;
  }

  // Check device locales
  const deviceLocales = RNLocalize.getLocales();
  for (const locale of deviceLocales) {
    const languageCode = locale.languageCode;
    if (SUPPORTED_LANGUAGES.includes(languageCode)) {
      return languageCode;
    }
  }

  // Fallback
  return FALLBACK_LANGUAGE;
}

/**
 * i18next Language Detector Plugin for React Native
 */
export const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  
  init: () => {},
  
  detect: () => {
    return detectLanguage();
  },
  
  cacheUserLanguage: (language: string) => {
    if (SUPPORTED_LANGUAGES.includes(language)) {
      i18nStorage.set(STORAGE_KEY, language);
    }
  },
};

export { i18nStorage };
