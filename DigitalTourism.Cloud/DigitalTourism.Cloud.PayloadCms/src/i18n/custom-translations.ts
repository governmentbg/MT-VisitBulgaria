import type { NestedKeysStripped } from '@payloadcms/translations'
import type { enTranslations } from '@payloadcms/translations/languages/en'

import en from './translations/en.json'
import bg from './translations/bg.json'

export const customTranslations = { en, bg }

export type CustomTranslationsObject = typeof en & typeof enTranslations
export type CustomTranslationsKeys =
  NestedKeysStripped<CustomTranslationsObject>
