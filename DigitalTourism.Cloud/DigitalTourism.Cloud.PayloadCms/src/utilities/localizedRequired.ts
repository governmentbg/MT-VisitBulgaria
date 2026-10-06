import { DEFAULT_LOCALE } from '@/i18n/localization'
import type { TextFieldSingleValidation, RichTextFieldValidation } from 'payload'

/**
 * Validation function that enforces "required" only for the default locale.
 *
 * For non-default locales, the field is optional — translations are added
 * when ready. This prevents the nested-docs plugin's `resaveChildren` from
 * failing validation when updating breadcrumbs on untranslated children.
 */
export const localizedRequiredText: TextFieldSingleValidation = (value, { req }) => {
  if (req.locale === DEFAULT_LOCALE && !value) {
    return 'This field is required.'
  }
  return true
}

export const localizedRequiredRichText: RichTextFieldValidation = (value, { req }) => {
  if (req.locale === DEFAULT_LOCALE && !value) {
    return 'This field is required.'
  }
  return true
}
