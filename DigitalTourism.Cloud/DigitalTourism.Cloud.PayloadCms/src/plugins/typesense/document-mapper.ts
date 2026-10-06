/**
 * Document mapper - transforms Payload documents to Typesense document format
 */

import type { CollectionConfig, FieldConfig } from './types'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:document-mapper')

/**
 * Get a nested value from an object using dot notation (T026)
 */
export function getNestedValue(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') {
    return undefined
  }

  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined
    }
    if (typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[part]
  }

  return current
}

/**
 * Extract plain text from Lexical rich text format (T027)
 */
export function extractRichText(content: unknown): string {
  if (content === null || content === undefined) {
    return ''
  }

  if (typeof content === 'string') {
    return content
  }

  if (typeof content !== 'object') {
    return String(content)
  }

  // Handle Lexical format with root node
  const contentObj = content as Record<string, unknown>
  if (contentObj.root && typeof contentObj.root === 'object') {
    return extractTextFromNodes((contentObj.root as Record<string, unknown>).children)
  }

  // Handle direct children array
  if (Array.isArray(contentObj.children)) {
    return extractTextFromNodes(contentObj.children)
  }

  return ''
}

/**
 * Recursively extract text from Lexical nodes
 */
function extractTextFromNodes(nodes: unknown): string {
  if (!Array.isArray(nodes)) {
    return ''
  }

  const texts: string[] = []

  for (const node of nodes) {
    if (typeof node !== 'object' || node === null) {
      continue
    }

    const nodeObj = node as Record<string, unknown>

    // Direct text node
    if (typeof nodeObj.text === 'string') {
      texts.push(nodeObj.text)
    }

    // Recurse into children
    if (Array.isArray(nodeObj.children)) {
      const childText = extractTextFromNodes(nodeObj.children)
      if (childText) {
        texts.push(childText)
      }
    }
  }

  return texts.join(' ').trim()
}

/**
 * Check if a value looks like a date
 */
function isDateLike(value: unknown): boolean {
  if (value instanceof Date) {
    return true
  }
  if (typeof value === 'string') {
    // ISO date string pattern
    return /^\d{4}-\d{2}-\d{2}/.test(value)
  }
  return false
}

/**
 * Convert a date value to timestamp
 */
function toTimestamp(value: unknown): number | null {
  if (value instanceof Date) {
    return value.getTime()
  }
  if (typeof value === 'string') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.getTime()
    }
  }
  return null
}

/**
 * Coerce a value to the expected Typesense type
 */
function coerceValue(value: unknown, type: string): unknown {
  if (value === undefined || value === null) {
    return undefined
  }

  // Handle int32/int64 - coerce strings to numbers
  if (type === 'int32' || type === 'int64') {
    if (typeof value === 'number') {
      return Math.floor(value)
    }
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10)
      return isNaN(parsed) ? undefined : parsed
    }
    return undefined
  }

  // Handle float - coerce strings to numbers
  if (type === 'float') {
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'string') {
      const parsed = parseFloat(value)
      return isNaN(parsed) ? undefined : parsed
    }
    return undefined
  }

  // Handle string - coerce to string
  if (type === 'string') {
    if (typeof value === 'string') {
      return value
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }
    // Skip objects/arrays that aren't strings
    return undefined
  }

  // Handle string[] - ensure it's an array of strings
  if (type === 'string[]') {
    if (Array.isArray(value)) {
      return value.filter((v) => typeof v === 'string')
    }
    if (typeof value === 'string') {
      return [value]
    }
    return undefined
  }

  // Handle bool
  if (type === 'bool') {
    if (typeof value === 'boolean') {
      return value
    }
    if (value === 'true' || value === 1) {
      return true
    }
    if (value === 'false' || value === 0) {
      return false
    }
    return undefined
  }

  return value
}

/**
 * Map a single document field to Typesense format (T028)
 */
export function mapDocumentField(
  doc: unknown,
  fieldName: string,
  config: FieldConfig
): unknown {
  // Apply custom transform if provided
  if (config.transform) {
    return config.transform(getNestedValue(doc, fieldName), doc)
  }

  // Handle geopoint with source fields
  if (
    (config.type === 'geopoint' || config.type === 'geopoint[]') &&
    config.source &&
    config.source.length === 2
  ) {
    const lat = getNestedValue(doc, config.source[0])
    const lng = getNestedValue(doc, config.source[1])

    if (typeof lat === 'number' && typeof lng === 'number') {
      return [lat, lng]
    }
    // Return undefined for optional geopoints, null for required
    return config.optional ? undefined : null
  }

  // Get the raw value
  const value = getNestedValue(doc, fieldName)

  if (value === undefined || value === null) {
    return config.optional ? undefined : null
  }

  // Handle date/timestamp conversion for int64
  if (config.type === 'int64' && isDateLike(value)) {
    return toTimestamp(value)
  }

  // Handle rich text extraction for string fields
  if (
    config.type === 'string' &&
    typeof value === 'object' &&
    value !== null &&
    'root' in (value as object)
  ) {
    return extractRichText(value)
  }

  // Coerce value to expected type
  const coerced = coerceValue(value, config.type)

  // If coercion failed and field is optional, return undefined
  if (coerced === undefined && config.optional) {
    return undefined
  }

  return coerced
}

/**
 * Map a complete Payload document to Typesense format (T029)
 */
export function mapDocument(
  doc: unknown,
  config: CollectionConfig,
  locale: string
): Record<string, unknown> {
  if (!doc || typeof doc !== 'object') {
    throw new Error('Document must be an object')
  }

  const docObj = doc as Record<string, unknown>
  const result: Record<string, unknown> = {}

  // Always include id
  if (docObj.id) {
    result.id = String(docObj.id)
  }

  // Get exclude set
  const excludeSet = new Set(config.exclude ?? [])

  // Map each configured field
  for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
    // Skip excluded fields
    if (excludeSet.has(fieldName)) {
      continue
    }

    const value = mapDocumentField(doc, fieldName, fieldConfig)

    // Only include defined, non-null values
    // Typesense doesn't accept null for typed fields
    if (value !== undefined && value !== null) {
      result[fieldName] = value
    }
  }

  logger.debug(`Mapped document ${result.id} for locale ${locale}`, {
    fieldCount: Object.keys(result).length,
  })

  return result
}

/**
 * Document validation result
 */
export interface DocumentValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate a document before indexing (T030)
 */
export function validateDocument(doc: unknown): DocumentValidationResult {
  const errors: string[] = []

  if (!doc || typeof doc !== 'object') {
    errors.push('Document must be an object')
    return { valid: false, errors }
  }

  const docObj = doc as Record<string, unknown>

  // Check for required id field
  if (!docObj.id) {
    errors.push('Document must have an id field')
  } else if (typeof docObj.id !== 'string') {
    errors.push('Document id must be a string')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Map documents for all locales
 */
export function mapDocumentForAllLocales(
  doc: unknown,
  config: CollectionConfig
): Array<{ locale: string; document: Record<string, unknown> }> {
  return config.locales.map((locale) => ({
    locale,
    document: mapDocument(doc, config, locale),
  }))
}
