import type { Field } from 'payload'
import { TRANSLATION_STATUS_FIELD, TRANSLATIONS_COLUMN_FIELD } from '../types'

const UI_COMPONENTS = {
  translationStatusCell:
    '@/plugins/localization-enhancement/ui/TranslationStatusCell#TranslationStatusCell',
}

/**
 * Hidden JSON field that stores the denormalized translation status map.
 * Not localized — the status object is the same regardless of current locale.
 */
export const translationStatusJsonField: Field = {
  name: TRANSLATION_STATUS_FIELD,
  type: 'json',
  localized: false,
  admin: {
    hidden: true,
    disableListColumn: true,
  },
}

/**
 * UI-only field that renders the translation status column in list views.
 */
export const translationStatusColumnField: Field = {
  name: TRANSLATIONS_COLUMN_FIELD,
  type: 'ui',
  admin: {
    components: {
      Cell: UI_COMPONENTS.translationStatusCell,
    },
  },
  label: { en: 'Translations', bg: 'Преводи' },
}
