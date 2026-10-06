import { slugField as payloadSlugField } from 'payload'
import type { RowField } from 'payload'
import { payloadSlugify } from '../../utilities/slugTransliterate'
import { localizedRequiredText } from '../../utilities/localizedRequired'

type TransliteratedSlugFieldArgs = {
  checkboxName?: string
  localized?: boolean
  name?: string
  overrides?: (field: RowField) => RowField
  position?: 'sidebar' | undefined
  required?: boolean
  useAsSlug?: string
}

/**
 * Drop-in replacement for Payload's `slugField()` with:
 * - Cyrillic-to-Latin transliteration (Bulgarian BGS, Russian)
 * - Accented Latin character normalization
 * - Custom admin component with live transliteration preview
 */
export const slugField = (args?: TransliteratedSlugFieldArgs) =>
  payloadSlugField({
    localized: true,
    required: true,
    ...args,
    slugify: payloadSlugify,
    overrides: (field) => {
      const slugTextField = field.fields[1]
      if (slugTextField && 'name' in slugTextField && 'admin' in slugTextField) {
        // Only enforce required for the default locale (same pattern as title/content)
        ;(slugTextField as { validate?: unknown }).validate = localizedRequiredText
        // Replace admin component with our custom one that shows live transliteration
        if (slugTextField.admin?.components) {
          slugTextField.admin.components.Field = {
            clientProps: { useAsSlug: args?.useAsSlug ?? 'title' },
            path: '@/fields/SlugField/SlugField.client#SlugFieldWithPreview',
          }
        }
      }

      // Chain any user-provided overrides
      if (args?.overrides) {
        return args.overrides(field)
      }

      return field
    },
  })
