import type { CollectionBeforeChangeHook, CollectionSlug, Field } from 'payload'
import type { TranslationStatusEntry, TranslationStatusMap } from '../types'
import { TRANSLATION_STATUS_FIELD } from '../types'
import { LOCALE_CODES } from '@/i18n/localization'

/**
 * Recursively collect field paths for all fields that are both `localized` and `required`.
 * Handles nested groups, tabs, arrays, and row/collapsible layouts.
 */
export function collectRequiredLocalizedFieldPaths(
  fields: Field[],
  prefix = '',
): string[] {
  const paths: string[] = []

  for (const field of fields) {
    if (field.type === 'tabs') {
      for (const tab of field.tabs) {
        if ('fields' in tab) {
          paths.push(...collectRequiredLocalizedFieldPaths(tab.fields, prefix))
        }
      }
      continue
    }

    if (field.type === 'row' || field.type === 'collapsible') {
      if ('fields' in field) {
        paths.push(...collectRequiredLocalizedFieldPaths(field.fields, prefix))
      }
      continue
    }

    if (!('name' in field)) continue

    const fullPath = prefix ? `${prefix}.${field.name}` : field.name

    if (field.type === 'group' && 'fields' in field) {
      paths.push(...collectRequiredLocalizedFieldPaths(field.fields, fullPath))
      continue
    }

    // Skip arrays, ui fields, and other non-data fields
    if (field.type === 'array' || field.type === 'ui') continue

    if ('localized' in field && field.localized && 'required' in field && field.required) {
      paths.push(fullPath)
    }
  }

  return paths
}

/**
 * Get a nested value from an object using a dot-separated path.
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }

  return current
}

/**
 * Check if a value is "filled" (non-null, non-empty string, non-empty array).
 */
function isFilled(value: unknown): boolean {
  if (value == null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return true
}

function computeLocaleStatus(
  translated: number,
  total: number,
): TranslationStatusEntry {
  let status: TranslationStatusEntry['status']
  if (translated === 0) status = 'missing'
  else if (translated === total) status = 'complete'
  else status = 'partial'
  return { status, translated, total }
}

/**
 * Compute status purely from an all-locale document (fetched with `locale: 'all'`).
 * Each localized field is an object like `{ en: value, bg: value, ... }`.
 *
 * Computes status from an all-locale document (fetched with `locale: 'all'`)
 * without any incoming data / current locale context.
 */
export function computeStatusMapFromAllLocaleDoc(
  allLocaleDoc: Record<string, unknown>,
  requiredLocalizedPaths: string[],
): TranslationStatusMap {
  const statusMap: TranslationStatusMap = {} as TranslationStatusMap
  const total = requiredLocalizedPaths.length

  for (const locale of LOCALE_CODES) {
    let translated = 0

    for (const fieldPath of requiredLocalizedPaths) {
      const allLocalesValue = getNestedValue(allLocaleDoc, fieldPath)
      let value: unknown

      if (allLocalesValue != null && typeof allLocalesValue === 'object' && !Array.isArray(allLocalesValue)) {
        value = (allLocalesValue as Record<string, unknown>)[locale]
      } else {
        value = allLocalesValue
      }

      if (isFilled(value)) {
        translated++
      }
    }

    statusMap[locale] = computeLocaleStatus(translated, total)
  }

  return statusMap
}

/**
 * Compute status for an update operation.
 *
 * `allLocaleDoc` was fetched with `locale: 'all'` and contains PRE-SAVE values
 * for every locale. For the locale being saved, we override with `incomingData`
 * (the new values). For all other locales we read straight from `allLocaleDoc`.
 *
 * With `locale: 'all'`, localized fields are returned as
 * `{ en: value, bg: value, ... }` objects.
 */
function computeStatusMapForUpdate(
  allLocaleDoc: Record<string, unknown>,
  incomingData: Record<string, unknown>,
  currentLocale: string,
  requiredLocalizedPaths: string[],
): TranslationStatusMap {
  const statusMap: TranslationStatusMap = {} as TranslationStatusMap
  const total = requiredLocalizedPaths.length

  for (const locale of LOCALE_CODES) {
    let translated = 0

    for (const fieldPath of requiredLocalizedPaths) {
      let value: unknown

      if (locale === currentLocale) {
        // For the locale being saved, use the incoming data (single-locale flat values)
        value = getNestedValue(incomingData, fieldPath)
      } else {
        // For other locales, extract from the all-locales document
        const allLocalesValue = getNestedValue(allLocaleDoc, fieldPath)
        if (allLocalesValue != null && typeof allLocalesValue === 'object' && !Array.isArray(allLocalesValue)) {
          value = (allLocalesValue as Record<string, unknown>)[locale]
        } else {
          // Non-object means locale wrapping wasn't applied (shouldn't happen
          // for localized fields, but handle gracefully)
          value = allLocalesValue
        }
      }

      if (isFilled(value)) {
        translated++
      }
    }

    statusMap[locale] = computeLocaleStatus(translated, total)
  }

  return statusMap
}

/**
 * Compute status for a create operation.
 * Only the current locale has data — all others are missing.
 */
function computeStatusMapForCreate(
  data: Record<string, unknown>,
  currentLocale: string,
  requiredLocalizedPaths: string[],
): TranslationStatusMap {
  const statusMap: TranslationStatusMap = {} as TranslationStatusMap
  const total = requiredLocalizedPaths.length

  let currentTranslated = 0
  for (const fieldPath of requiredLocalizedPaths) {
    if (isFilled(getNestedValue(data, fieldPath))) {
      currentTranslated++
    }
  }

  for (const locale of LOCALE_CODES) {
    if (locale === currentLocale) {
      statusMap[locale] = computeLocaleStatus(currentTranslated, total)
    } else {
      statusMap[locale] = { status: 'missing', translated: 0, total }
    }
  }

  return statusMap
}

/**
 * Create a beforeChange hook that computes translation status and sets it
 * on the data object so it's saved in the same DB write — no second update needed.
 */
export function createUpdateTranslationStatusHook(
  collectionSlug: string,
  requiredLocalizedPaths: string[],
): CollectionBeforeChangeHook {
  return async ({ data, req, operation, originalDoc, context }) => {
    if (requiredLocalizedPaths.length === 0) {
      return data
    }

    // Allow callers to skip re-computation via context flag
    if (context?.skipTranslationStatusUpdate) {
      return data
    }

    try {
      const currentLocale = req.locale || 'en'
      let statusMap: TranslationStatusMap

      if (operation === 'create') {
        statusMap = computeStatusMapForCreate(
          data as Record<string, unknown>,
          currentLocale,
          requiredLocalizedPaths,
        )
      } else {
        // Fetch the full document with all locale values.
        // `draft: true` ensures we get the latest draft for versioned collections
        // (ignored for non-versioned collections).
        try {
          const allLocaleDoc = await req.payload.findByID({
            id: originalDoc.id,
            collection: collectionSlug as CollectionSlug,
            locale: 'all',
            depth: 0,
            draft: true,
          })

          statusMap = computeStatusMapForUpdate(
            allLocaleDoc as unknown as Record<string, unknown>,
            data as Record<string, unknown>,
            currentLocale,
            requiredLocalizedPaths,
          )
        } catch {
          // Document may not be fully persisted yet (e.g. internal locale patches
          // during a create operation). Fall back to create-style computation.
          statusMap = computeStatusMapForCreate(
            data as Record<string, unknown>,
            currentLocale,
            requiredLocalizedPaths,
          )
        }
      }

      data[TRANSLATION_STATUS_FIELD] = statusMap
    } catch (error) {
      req.payload.logger.error(
        { err: error, collection: collectionSlug },
        'Failed to compute translation status',
      )
    }

    return data
  }
}
