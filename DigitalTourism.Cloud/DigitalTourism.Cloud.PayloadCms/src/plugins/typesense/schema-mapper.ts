/**
 * Schema mapper - converts Payload collection configurations to Typesense schemas
 */

import type {
  FieldConfig,
  CollectionConfig,
  TypesenseSchema,
  TypesenseFieldSchema,
  TypesenseFieldType,
} from './types'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:schema-mapper')

const STRING_TYPES: TypesenseFieldType[] = ['string', 'string[]']

/**
 * Map a single field configuration to Typesense field schema (T015)
 */
export function mapFieldConfig(
  name: string,
  config: FieldConfig,
  locale?: string
): TypesenseFieldSchema {
  const field: TypesenseFieldSchema = {
    name,
    type: config.type,
  }

  // Add optional flags only when set
  if (config.facet === true) {
    field.facet = true
  }

  if (config.optional === true) {
    field.optional = true
  }

  if (config.sort === true) {
    field.sort = true
  }

  if (config.infix === true) {
    field.infix = true
  }

  if (config.rangeIndex === true) {
    field.range_index = true
  }

  // Apply locale for string types
  // Field-specific locale takes precedence over collection locale
  if (config.locale) {
    field.locale = config.locale
  } else if (locale && STRING_TYPES.includes(config.type)) {
    field.locale = locale
  }

  return field
}

/**
 * Handle geopoint source field merging logic (T016)
 *
 * When a geopoint field has a source configuration, it means the lat/lng values
 * come from separate fields in the Payload document. The schema field name
 * remains the same - the source is used during document transformation.
 */
export function getGeopointSourceFields(config: FieldConfig): {
  latField: string
  lngField: string
} | null {
  if (
    (config.type === 'geopoint' || config.type === 'geopoint[]') &&
    config.source &&
    config.source.length === 2
  ) {
    return {
      latField: config.source[0],
      lngField: config.source[1],
    }
  }
  return null
}

/**
 * Map a complete collection configuration to Typesense schema (T017)
 */
export function mapCollectionConfig(
  collectionSlug: string,
  config: CollectionConfig,
  locale: string
): TypesenseSchema {
  const collectionName = `${collectionSlug}_${locale}`
  logger.debug(`Mapping collection '${collectionSlug}' for locale '${locale}'`)

  // Start with required 'id' field
  const fields: TypesenseFieldSchema[] = [
    {
      name: 'id',
      type: 'string',
    },
  ]

  // Get exclude list
  const excludeSet = new Set(config.exclude ?? [])

  // Map all configured fields
  for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
    // Skip excluded fields
    if (excludeSet.has(fieldName)) {
      logger.debug(`Skipping excluded field '${fieldName}'`)
      continue
    }

    const field = mapFieldConfig(fieldName, fieldConfig, locale)
    fields.push(field)
  }

  const schema: TypesenseSchema = {
    name: collectionName,
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

  logger.debug(`Generated schema for '${collectionName}' with ${fields.length} fields`)
  return schema
}

/**
 * Schema validation result
 */
export interface SchemaValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate a generated Typesense schema (T018)
 */
export function validateSchema(schema: TypesenseSchema): SchemaValidationResult {
  const errors: string[] = []

  // Check for empty fields
  if (!schema.fields || schema.fields.length === 0) {
    errors.push('Schema must have at least one field')
  }

  // Check for required 'id' field
  const hasIdField = schema.fields?.some((f) => f.name === 'id')
  if (!hasIdField) {
    errors.push("Schema must include 'id' field")
  }

  // Validate default_sorting_field exists and is numeric
  if (schema.default_sorting_field) {
    const sortField = schema.fields?.find((f) => f.name === schema.default_sorting_field)
    if (!sortField) {
      errors.push(
        `default_sorting_field '${schema.default_sorting_field}' does not exist in schema`
      )
    } else if (!['int32', 'int64', 'float'].includes(sortField.type)) {
      errors.push(
        `default_sorting_field '${schema.default_sorting_field}' must be a numeric type (int32, int64, or float)`
      )
    }
  }

  // Check for duplicate field names
  const fieldNames = schema.fields?.map((f) => f.name) ?? []
  const uniqueNames = new Set(fieldNames)
  if (fieldNames.length !== uniqueNames.size) {
    const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index)
    errors.push(`Duplicate field names: ${duplicates.join(', ')}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate schemas for all locales of a collection
 */
export function generateAllLocaleSchemas(
  collectionSlug: string,
  config: CollectionConfig
): TypesenseSchema[] {
  return config.locales.map((locale) => mapCollectionConfig(collectionSlug, config, locale))
}
