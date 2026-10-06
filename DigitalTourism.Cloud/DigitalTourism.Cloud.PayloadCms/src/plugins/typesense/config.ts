/**
 * Configuration validation for Typesense plugin
 */

import type {
  TypesensePluginConfig,
  TypesenseConnection,
  CollectionConfig,
  FieldConfig,
  TypesenseFieldType,
} from './types'

export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly path: string,
  ) {
    super(`Configuration error at '${path}': ${message}`)
    this.name = 'ConfigValidationError'
  }
}

const VALID_FIELD_TYPES: TypesenseFieldType[] = [
  'string',
  'string[]',
  'int32',
  'int32[]',
  'int64',
  'int64[]',
  'float',
  'float[]',
  'bool',
  'bool[]',
  'geopoint',
  'geopoint[]',
  'object',
  'object[]',
  'auto',
]

const NUMERIC_TYPES: TypesenseFieldType[] = ['int32', 'int64', 'float']
const STRING_TYPES: TypesenseFieldType[] = ['string', 'string[]']
const FACETABLE_TYPES: TypesenseFieldType[] = [
  'string',
  'int32',
  'int64',
  'float',
  'bool',
  'string[]',
  'int32[]',
]

/**
 * Validate the complete plugin configuration
 */
export function validateConfig(config: TypesensePluginConfig): void {
  if (!config) {
    throw new ConfigValidationError('Configuration is required', 'config')
  }

  validateConnection(config.connection)
  validateCollections(config.collections)

  if (config.settings) {
    validateSettings(config.settings)
  }
}

/**
 * Validate connection configuration
 */
function validateConnection(connection: TypesenseConnection): void {
  if (!connection) {
    throw new ConfigValidationError('Connection configuration is required', 'connection')
  }

  if (!connection.apiKey || typeof connection.apiKey !== 'string') {
    throw new ConfigValidationError('API key must be a non-empty string', 'connection.apiKey')
  }

  if (!connection.nodes || !Array.isArray(connection.nodes) || connection.nodes.length === 0) {
    throw new ConfigValidationError('At least one node must be configured', 'connection.nodes')
  }

  connection.nodes.forEach((node, index) => {
    const path = `connection.nodes[${index}]`

    if (!node.host || typeof node.host !== 'string') {
      throw new ConfigValidationError('Host must be a non-empty string', `${path}.host`)
    }

    if (typeof node.port !== 'number' || node.port < 1 || node.port > 65535) {
      throw new ConfigValidationError('Port must be a valid port number (1-65535)', `${path}.port`)
    }

    if (node.protocol !== 'http' && node.protocol !== 'https') {
      throw new ConfigValidationError("Protocol must be 'http' or 'https'", `${path}.protocol`)
    }
  })

  if (
    connection.connectionTimeoutSeconds !== undefined &&
    (typeof connection.connectionTimeoutSeconds !== 'number' ||
      connection.connectionTimeoutSeconds < 1)
  ) {
    throw new ConfigValidationError(
      'Connection timeout must be a positive number',
      'connection.connectionTimeoutSeconds',
    )
  }

  if (
    connection.numRetries !== undefined &&
    (typeof connection.numRetries !== 'number' || connection.numRetries < 0)
  ) {
    throw new ConfigValidationError(
      'Number of retries must be a non-negative number',
      'connection.numRetries',
    )
  }
}

/**
 * Validate collections configuration
 */
function validateCollections(collections: Record<string, CollectionConfig>): void {
  if (!collections || typeof collections !== 'object') {
    throw new ConfigValidationError('Collections configuration is required', 'collections')
  }

  const collectionNames = Object.keys(collections)
  if (collectionNames.length === 0) {
    throw new ConfigValidationError('At least one collection must be configured', 'collections')
  }

  for (const [name, config] of Object.entries(collections)) {
    validateCollectionConfig(name, config)
  }
}

/**
 * Validate a single collection configuration
 */
function validateCollectionConfig(name: string, config: CollectionConfig): void {
  const path = `collections.${name}`

  if (!config) {
    throw new ConfigValidationError('Collection configuration is required', path)
  }

  // Validate locales
  if (!config.locales || !Array.isArray(config.locales) || config.locales.length === 0) {
    throw new ConfigValidationError('At least one locale must be configured', `${path}.locales`)
  }

  for (const locale of config.locales) {
    if (typeof locale !== 'string' || locale.length === 0) {
      throw new ConfigValidationError('Each locale must be a non-empty string', `${path}.locales`)
    }
  }

  // Validate fields
  if (!config.fields || typeof config.fields !== 'object') {
    throw new ConfigValidationError('Fields configuration is required', `${path}.fields`)
  }

  const fieldNames = Object.keys(config.fields)
  if (fieldNames.length === 0) {
    throw new ConfigValidationError('At least one field must be configured', `${path}.fields`)
  }

  for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
    validateFieldConfig(fieldName, fieldConfig, `${path}.fields.${fieldName}`)
  }

  // Validate defaultSortingField if provided
  if (config.defaultSortingField) {
    const sortField = config.fields[config.defaultSortingField]
    if (!sortField) {
      throw new ConfigValidationError(
        `Default sorting field '${config.defaultSortingField}' is not defined in fields`,
        `${path}.defaultSortingField`,
      )
    }

    if (!NUMERIC_TYPES.includes(sortField.type)) {
      throw new ConfigValidationError(
        `Default sorting field must be int32, int64, or float (got '${sortField.type}')`,
        `${path}.defaultSortingField`,
      )
    }
  }

  // Validate exclude list
  if (config.exclude) {
    if (!Array.isArray(config.exclude)) {
      throw new ConfigValidationError('Exclude must be an array', `${path}.exclude`)
    }

    for (const excluded of config.exclude) {
      if (typeof excluded !== 'string') {
        throw new ConfigValidationError('Each excluded field must be a string', `${path}.exclude`)
      }
    }
  }
}

/**
 * Validate a single field configuration
 */
function validateFieldConfig(name: string, config: FieldConfig, path: string): void {
  if (!config) {
    throw new ConfigValidationError('Field configuration is required', path)
  }

  // Validate field name
  if (name.includes(' ')) {
    throw new ConfigValidationError('Field name must not contain spaces', path)
  }

  // Validate type
  if (!config.type || !VALID_FIELD_TYPES.includes(config.type)) {
    throw new ConfigValidationError(
      `Invalid field type '${config.type}'. Must be one of: ${VALID_FIELD_TYPES.join(', ')}`,
      `${path}.type`,
    )
  }

  // Validate geopoint source
  if (config.type === 'geopoint' || config.type === 'geopoint[]') {
    if (config.source) {
      if (!Array.isArray(config.source) || config.source.length !== 2) {
        throw new ConfigValidationError(
          'Geopoint source must be an array of exactly 2 field paths [lat, lng]',
          `${path}.source`,
        )
      }

      if (typeof config.source[0] !== 'string' || typeof config.source[1] !== 'string') {
        throw new ConfigValidationError('Geopoint source paths must be strings', `${path}.source`)
      }
    }
  }

  // Validate rangeIndex (only for numeric types)
  if (config.rangeIndex && !NUMERIC_TYPES.includes(config.type)) {
    throw new ConfigValidationError(
      `rangeIndex can only be used with numeric types (int32, int64, float)`,
      `${path}.rangeIndex`,
    )
  }

  // Validate infix (only for string types)
  if (config.infix && !STRING_TYPES.includes(config.type)) {
    throw new ConfigValidationError(`infix can only be used with string types`, `${path}.infix`)
  }

  // Validate facet (only for facetable types)
  if (config.facet && !FACETABLE_TYPES.includes(config.type)) {
    throw new ConfigValidationError(
      `facet can only be used with string, int32, int64, float, or bool types`,
      `${path}.facet`,
    )
  }
}

/**
 * Validate plugin settings
 */
function validateSettings(settings: NonNullable<TypesensePluginConfig['settings']>): void {
  const path = 'settings'

  if (settings.logLevel && !['debug', 'info', 'warn', 'error'].includes(settings.logLevel)) {
    throw new ConfigValidationError(
      "Log level must be 'debug', 'info', 'warn', or 'error'",
      `${path}.logLevel`,
    )
  }

  if (
    settings.maxRetries !== undefined &&
    (typeof settings.maxRetries !== 'number' || settings.maxRetries < 0)
  ) {
    throw new ConfigValidationError(
      'Max retries must be a non-negative number',
      `${path}.maxRetries`,
    )
  }

  if (
    settings.batchSize !== undefined &&
    (typeof settings.batchSize !== 'number' || settings.batchSize < 1)
  ) {
    throw new ConfigValidationError('Batch size must be a positive number', `${path}.batchSize`)
  }
}

/**
 * Get default settings merged with provided settings
 */
export function getDefaultSettings(
  settings?: TypesensePluginConfig['settings'],
): Required<NonNullable<TypesensePluginConfig['settings']>> {
  return {
    logLevel: settings?.logLevel ?? 'warn',
    retryOnError: settings?.retryOnError ?? true,
    maxRetries: settings?.maxRetries ?? 3,
    batchSize: settings?.batchSize ?? 1000,
  }
}
