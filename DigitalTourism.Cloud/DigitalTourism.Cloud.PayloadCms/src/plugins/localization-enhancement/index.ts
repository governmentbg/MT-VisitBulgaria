/**
 * Localization Enhancement Plugin
 *
 * Provides translation status tracking in list views and unsaved changes
 * guard when switching locales. Follows the editorial-workflow plugin pattern.
 */

import type { CollectionConfig, Config, Field } from 'payload'
import type { LocalizationEnhancementConfig } from './types'
import { TRANSLATION_STATUS_FIELD, TRANSLATIONS_COLUMN_FIELD } from './types'
import {
  collectRequiredLocalizedFieldPaths,
  createUpdateTranslationStatusHook,
} from './hooks/updateTranslationStatus'
import {
  translationStatusJsonField,
  translationStatusColumnField,
} from './fields/translationStatusField'
import { translations } from './i18n'

const DEFAULT_EXCLUDE = ['media', 'users', 'workflow-history']

/**
 * Check if a collection has any localized fields (recursive).
 */
function hasLocalizedFields(fields: Field[]): boolean {
  for (const field of fields) {
    if ('localized' in field && field.localized) {
      return true
    }

    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('fields' in tab && hasLocalizedFields(tab.fields)) {
          return true
        }
      }
    }

    if (field.type === 'group' && 'fields' in field) {
      if (hasLocalizedFields(field.fields)) return true
    }

    if (field.type === 'row' || field.type === 'collapsible') {
      if ('fields' in field && hasLocalizedFields(field.fields)) return true
    }

    if (field.type === 'array' && 'fields' in field) {
      if (hasLocalizedFields(field.fields)) return true
    }
  }

  return false
}

/**
 * Check if a collection already has a field with the given name.
 */
function hasField(collection: CollectionConfig, fieldName: string): boolean {
  const checkFields = (fields: Field[]): boolean => {
    for (const field of fields) {
      if ('name' in field && field.name === fieldName) {
        return true
      }
      if (field.type === 'tabs') {
        for (const tab of field.tabs) {
          if ('fields' in tab && checkFields(tab.fields)) {
            return true
          }
        }
      }
      if (field.type === 'group' && 'fields' in field) {
        if (checkFields(field.fields)) return true
      }
      if (field.type === 'array' && 'fields' in field) {
        if (checkFields(field.fields)) return true
      }
    }
    return false
  }
  return checkFields(collection.fields || [])
}

/**
 * Deep merge translations.
 */
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target }
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object'
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      )
    } else {
      result[key] = source[key]
    }
  }
  return result
}

/**
 * Localization Enhancement Plugin factory.
 */
export const localizationEnhancementPlugin =
  (pluginConfig: LocalizationEnhancementConfig = {}) =>
  (incomingConfig: Config): Config => {
    const excludeList = pluginConfig.exclude ?? DEFAULT_EXCLUDE
    const addToDefaultColumns = pluginConfig.addToDefaultColumns !== false

    const processedCollections = (incomingConfig.collections || []).map((collection) => {
      // Skip excluded collections
      if (excludeList.includes(collection.slug)) {
        return collection
      }

      // Skip collections without localized fields
      if (!hasLocalizedFields(collection.fields || [])) {
        return collection
      }

      // Skip if fields already injected
      if (hasField(collection, TRANSLATION_STATUS_FIELD)) {
        return collection
      }

      // Collect required localized field paths at plugin init time
      const requiredLocalizedPaths = collectRequiredLocalizedFieldPaths(collection.fields || [])

      // Build hooks — use beforeChange so the status is written in the same DB operation
      const existingHooks = collection.hooks || {}
      const newHooks = {
        ...existingHooks,
        beforeChange: [
          ...(existingHooks.beforeChange || []),
          createUpdateTranslationStatusHook(collection.slug, requiredLocalizedPaths),
        ],
      }

      // Add fields
      const existingFields = collection.fields || []
      const newFields: Field[] = [
        ...existingFields,
        translationStatusJsonField,
        translationStatusColumnField,
      ]

      // Optionally add translations column to defaultColumns.
      // When the collection has no defaultColumns, Payload auto-generates them
      // but won't include UI fields. So we construct a minimal default using
      // the collection's useAsTitle field to keep the title column visible.
      const existingAdmin = collection.admin || {}
      let newAdmin = { ...existingAdmin }

      if (addToDefaultColumns) {
        const existingDefaultColumns = existingAdmin.defaultColumns
        if (existingDefaultColumns) {
          // Append to existing defaultColumns
          if (!existingDefaultColumns.includes(TRANSLATIONS_COLUMN_FIELD)) {
            newAdmin = {
              ...newAdmin,
              defaultColumns: [...existingDefaultColumns, TRANSLATIONS_COLUMN_FIELD],
            }
          }
        } else {
          // No defaultColumns defined — construct a minimal set so the title stays visible
          const titleField = existingAdmin.useAsTitle || 'title'
          newAdmin = {
            ...newAdmin,
            defaultColumns: [titleField, TRANSLATIONS_COLUMN_FIELD],
          }
        }
      }

      // Inject locale indicator into the document controls bar
      const existingComponents = newAdmin.components || {}
      const existingEdit = existingComponents.edit || {}
      newAdmin = {
        ...newAdmin,
        components: {
          ...existingComponents,
          edit: {
            ...existingEdit,
            beforeDocumentControls: [
              ...(existingEdit.beforeDocumentControls || []),
              '@/plugins/localization-enhancement/ui/LocaleIndicator#LocaleIndicator',
            ],
            editMenuItems: [
              ...(existingEdit.editMenuItems || []),
              '@/plugins/localization-enhancement/ui/CopyFromLocale#CopyFromLocale',
            ],
          },
        },
      }

      return {
        ...collection,
        fields: newFields,
        hooks: newHooks,
        admin: newAdmin,
      }
    })

    // Merge i18n translations
    const mergedI18n = {
      ...incomingConfig.i18n,
      translations: deepMerge(translations, incomingConfig.i18n?.translations ?? {}),
    }

    return {
      ...incomingConfig,
      collections: processedCollections,
      i18n: mergedI18n,
    }
  }

export type { LocalizationEnhancementConfig, TranslationStatusMap, TranslationStatus } from './types'
export { TRANSLATION_STATUS_FIELD, TRANSLATIONS_COLUMN_FIELD } from './types'
