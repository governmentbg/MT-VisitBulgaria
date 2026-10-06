/**
 * Locale management - handles per-locale Typesense collections (T035-T038)
 */

import type { CollectionConfig, TypesenseSchema, TypesenseFieldSchema } from './types'
import { mapFieldConfig } from './schema-mapper'
import { getClient } from './client'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:locale')

/**
 * Get the locale-suffixed collection name (T035)
 *
 * @example
 * getCollectionName('experiences', 'en') // 'experiences_en'
 * getCollectionName('experiences', 'bg') // 'experiences_bg'
 */
export function getCollectionName(collection: string, locale: string): string {
  return `${collection}_${locale}`
}

/**
 * Resolve the Typesense collection name, accounting for targetCollection.
 *
 * When `config.targetCollection` is set, multiple Payload collections share a
 * single Typesense collection (e.g., hotels/restaurants/... → experiences_{locale}).
 */
export function resolveTypesenseCollectionName(
  payloadSlug: string,
  config: CollectionConfig,
  locale: string,
): string {
  return getCollectionName(config.targetCollection || payloadSlug, locale)
}

/**
 * Resolve the document ID for Typesense, prefixing with the Payload slug when
 * multiple collections share a targetCollection to prevent ID collisions.
 *
 * @example
 * resolveDocumentId('hotels', '42', configWithTarget) // 'hotels_42'
 * resolveDocumentId('cities', '42', configWithoutTarget) // '42'
 */
export function resolveDocumentId(
  payloadSlug: string,
  docId: string,
  config: CollectionConfig,
): string {
  return config.targetCollection ? `${payloadSlug}_${docId}` : docId
}

/**
 * Check if a value is a locale object (has locale keys)
 */
function isLocaleObject(value: unknown, locale: string): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  // Check if the object has the locale as a key
  return locale in (value as Record<string, unknown>)
}

/**
 * Extract localized values from a document for a specific locale (T036)
 *
 * Handles both localized fields (objects with locale keys) and non-localized fields.
 *
 * @param doc - The Payload document with potentially localized fields
 * @param locale - The locale to extract values for (e.g., 'en', 'bg')
 * @param localizedFields - Array of field paths that are localized
 * @returns Document with locale-specific values extracted
 */
export function extractLocalizedValues(
  doc: unknown,
  locale: string,
  localizedFields: string[],
): Record<string, unknown> {
  if (!doc || typeof doc !== 'object') {
    return {}
  }

  const docObj = doc as Record<string, unknown>
  const result: Record<string, unknown> = {}
  const localizedFieldSet = new Set(localizedFields)

  for (const [key, value] of Object.entries(docObj)) {
    // Check if this is a nested localized field path
    const isNestedLocalizedPath = localizedFields.some((f) => f.startsWith(`${key}.`) || f === key)

    if (localizedFieldSet.has(key) && isLocaleObject(value, locale)) {
      // This field is localized - extract the locale-specific value
      result[key] = (value as Record<string, unknown>)[locale]
    } else if (
      localizedFieldSet.has(key) &&
      isLocaleObject(value, 'en') &&
      !isLocaleObject(value, locale)
    ) {
      // Field is localized but doesn't have this locale
      result[key] = undefined
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      isNestedLocalizedPath
    ) {
      // Handle nested objects - check for nested localized fields
      const nestedLocalizedFields = localizedFields
        .filter((f) => f.startsWith(`${key}.`))
        .map((f) => f.slice(key.length + 1))

      if (nestedLocalizedFields.length > 0) {
        result[key] = extractLocalizedValues(value, locale, nestedLocalizedFields)
      } else if (localizedFieldSet.has(key) && isLocaleObject(value, locale)) {
        result[key] = (value as Record<string, unknown>)[locale]
      } else {
        result[key] = value
      }
    } else {
      // Non-localized field - copy as-is
      result[key] = value
    }
  }

  return result
}

/**
 * Get the Typesense collection schema for a specific locale (T038)
 *
 * Generates a schema with:
 * - Locale-suffixed collection name
 * - Locale parameter applied to string fields for language-specific tokenization
 */
export function getCollectionSchema(
  collectionSlug: string,
  config: CollectionConfig,
  locale: string,
): TypesenseSchema {
  const excludeSet = new Set(config.exclude ?? [])
  const fields: TypesenseFieldSchema[] = []

  // Always include id field
  fields.push({
    name: 'id',
    type: 'string',
    facet: false,
    optional: false,
  })

  // Map each configured field
  for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
    // Skip excluded fields
    if (excludeSet.has(fieldName)) {
      continue
    }

    // Map field with locale for string types
    const isStringType = fieldConfig.type === 'string' || fieldConfig.type === 'string[]'
    const fieldLocale = isStringType ? locale : undefined

    const mappedField = mapFieldConfig(fieldName, fieldConfig, fieldLocale)
    fields.push(mappedField)
  }

  const schema: TypesenseSchema = {
    name: getCollectionName(collectionSlug, locale),
    fields,
  }

  // Add optional schema properties
  if (config.defaultSortingField) {
    schema.default_sorting_field = config.defaultSortingField
  }

  if (config.tokenSeparators && config.tokenSeparators.length > 0) {
    schema.token_separators = config.tokenSeparators
  }

  if (config.symbolsToIndex && config.symbolsToIndex.length > 0) {
    schema.symbols_to_index = config.symbolsToIndex
  }

  return schema
}

/**
 * Ensure a Typesense collection exists, creating it if necessary (T037)
 *
 * @param collectionSlug - The base collection name
 * @param config - Collection configuration
 * @param locale - The locale for this collection
 * @returns true if collection was created, false if it already existed
 */
export async function ensureCollection(
  collectionSlug: string,
  config: CollectionConfig,
  locale: string,
): Promise<{ created: boolean; name: string }> {
  const client = getClient()
  const collectionName = getCollectionName(collectionSlug, locale)

  try {
    // Try to retrieve the collection
    const existingCollection = await client.collections(collectionName).retrieve()
    logger.debug(`Collection ${collectionName} already exists`, {
      schema: JSON.stringify(existingCollection, null, 2),
    })
    return { created: false, name: collectionName }
  } catch (_error) {
    // Collection doesn't exist - create it
    const schema = getCollectionSchema(collectionSlug, config, locale)

    logger.info(`Creating collection ${collectionName}`, {
      schema: JSON.stringify(schema, null, 2),
    })
    await client.collections().create(schema)

    return { created: true, name: collectionName }
  }
}

/**
 * Ensure all locale collections exist for a Payload collection
 */
export async function ensureAllLocaleCollections(
  collectionSlug: string,
  config: CollectionConfig,
): Promise<Array<{ locale: string; created: boolean; name: string }>> {
  const results: Array<{ locale: string; created: boolean; name: string }> = []

  for (const locale of config.locales) {
    const result = await ensureCollection(collectionSlug, config, locale)
    results.push({ locale, ...result })
  }

  return results
}

/**
 * Delete a locale-specific collection
 */
export async function deleteCollection(collectionSlug: string, locale: string): Promise<void> {
  const client = getClient()
  const collectionName = getCollectionName(collectionSlug, locale)

  try {
    await client.collections(collectionName).delete()
    logger.info(`Deleted collection ${collectionName}`)
  } catch (_error) {
    logger.warn(`Failed to delete collection ${collectionName}`, { error: _error })
  }
}

/**
 * Get all locale collection names for a Payload collection
 */
export function getAllCollectionNames(collectionSlug: string, locales: string[]): string[] {
  return locales.map((locale) => getCollectionName(collectionSlug, locale))
}

/**
 * Check if a collection exists
 */
export async function collectionExists(collectionSlug: string, locale: string): Promise<boolean> {
  const client = getClient()
  const collectionName = getCollectionName(collectionSlug, locale)

  try {
    await client.collections(collectionName).retrieve()
    return true
  } catch {
    return false
  }
}
