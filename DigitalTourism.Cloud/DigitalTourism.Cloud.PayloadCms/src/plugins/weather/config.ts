/**
 * Configuration validation for Weather plugin
 */

import type {
  WeatherPluginConfig,
  WeatherProviderConfig,
  CacheConfig,
  PluginSettings,
} from './types'

export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly path: string,
  ) {
    super(`Weather plugin configuration error at '${path}': ${message}`)
    this.name = 'ConfigValidationError'
  }
}

const VALID_PROVIDER_TYPES = ['weatherapi', 'openweathermap'] as const
const VALID_LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const

/**
 * Validate the complete plugin configuration
 */
export function validateConfig(config: WeatherPluginConfig): void {
  if (!config) {
    throw new ConfigValidationError('Configuration is required', 'config')
  }

  validateProvider(config.provider)

  if (config.cache) {
    validateCacheConfig(config.cache)
  }

  if (config.collections) {
    validateCollectionsConfig(config.collections)
  }

  if (config.settings) {
    validateSettings(config.settings)
  }
}

/**
 * Validate provider configuration
 */
function validateProvider(
  provider: WeatherPluginConfig['provider'],
): void {
  if (!provider) {
    throw new ConfigValidationError('Provider configuration is required', 'provider')
  }

  // Check if it's a provider instance (has 'name' property and methods)
  if (typeof provider === 'object' && 'name' in provider && typeof provider.name === 'string') {
    // It's a WeatherProvider instance
    if (typeof provider.getCurrentWeather !== 'function') {
      throw new ConfigValidationError(
        'Provider must implement getCurrentWeather method',
        'provider',
      )
    }
    if (typeof provider.getWeatherWithForecast !== 'function') {
      throw new ConfigValidationError(
        'Provider must implement getWeatherWithForecast method',
        'provider',
      )
    }
    if (typeof provider.testConnection !== 'function') {
      throw new ConfigValidationError(
        'Provider must implement testConnection method',
        'provider',
      )
    }
    return
  }

  // It's a WeatherProviderConfig
  const providerConfig = provider as WeatherProviderConfig

  if (!providerConfig.type) {
    throw new ConfigValidationError(
      `Provider type is required. Must be one of: ${VALID_PROVIDER_TYPES.join(', ')}`,
      'provider.type',
    )
  }

  if (!VALID_PROVIDER_TYPES.includes(providerConfig.type as typeof VALID_PROVIDER_TYPES[number])) {
    throw new ConfigValidationError(
      `Invalid provider type '${providerConfig.type}'. Must be one of: ${VALID_PROVIDER_TYPES.join(', ')}`,
      'provider.type',
    )
  }

  if (!providerConfig.apiKey || typeof providerConfig.apiKey !== 'string') {
    throw new ConfigValidationError(
      'API key must be a non-empty string',
      'provider.apiKey',
    )
  }

  if (providerConfig.apiKey.trim() === '') {
    throw new ConfigValidationError(
      'API key must be a non-empty string',
      'provider.apiKey',
    )
  }
}

/**
 * Validate cache configuration
 */
function validateCacheConfig(cache: CacheConfig): void {
  const path = 'cache'

  if (
    cache.currentWeatherTTL !== undefined &&
    (typeof cache.currentWeatherTTL !== 'number' || cache.currentWeatherTTL < 0)
  ) {
    throw new ConfigValidationError(
      'Current weather TTL must be a non-negative number (seconds)',
      `${path}.currentWeatherTTL`,
    )
  }

  if (
    cache.forecastTTL !== undefined &&
    (typeof cache.forecastTTL !== 'number' || cache.forecastTTL < 0)
  ) {
    throw new ConfigValidationError(
      'Forecast TTL must be a non-negative number (seconds)',
      `${path}.forecastTTL`,
    )
  }

  if (cache.keyPrefix !== undefined && typeof cache.keyPrefix !== 'string') {
    throw new ConfigValidationError('Key prefix must be a string', `${path}.keyPrefix`)
  }
}

/**
 * Validate collections configuration
 */
function validateCollectionsConfig(
  collections: NonNullable<WeatherPluginConfig['collections']>,
): void {
  const path = 'collections'

  if (
    collections.experiences !== undefined &&
    typeof collections.experiences !== 'boolean'
  ) {
    throw new ConfigValidationError(
      'Experiences flag must be a boolean',
      `${path}.experiences`,
    )
  }

  if (collections.cities !== undefined && typeof collections.cities !== 'boolean') {
    throw new ConfigValidationError('Cities flag must be a boolean', `${path}.cities`)
  }
}

/**
 * Validate plugin settings
 */
function validateSettings(settings: PluginSettings): void {
  const path = 'settings'

  if (
    settings.logLevel &&
    !VALID_LOG_LEVELS.includes(settings.logLevel as typeof VALID_LOG_LEVELS[number])
  ) {
    throw new ConfigValidationError(
      `Log level must be one of: ${VALID_LOG_LEVELS.join(', ')}`,
      `${path}.logLevel`,
    )
  }

  if (
    settings.defaultForecastDays !== undefined &&
    (typeof settings.defaultForecastDays !== 'number' ||
      settings.defaultForecastDays < 1 ||
      settings.defaultForecastDays > 3)
  ) {
    throw new ConfigValidationError(
      'Default forecast days must be between 1 and 3 (free tier limit)',
      `${path}.defaultForecastDays`,
    )
  }

  if (settings.locales !== undefined) {
    if (!Array.isArray(settings.locales)) {
      throw new ConfigValidationError('Locales must be an array', `${path}.locales`)
    }

    for (const locale of settings.locales) {
      if (typeof locale !== 'string' || locale.trim() === '') {
        throw new ConfigValidationError(
          'Each locale must be a non-empty string',
          `${path}.locales`,
        )
      }
    }
  }
}

/**
 * Get default cache configuration merged with provided config
 */
export function getDefaultCacheConfig(cache?: CacheConfig): Required<CacheConfig> {
  return {
    currentWeatherTTL: cache?.currentWeatherTTL ?? 900, // 15 minutes
    forecastTTL: cache?.forecastTTL ?? 3600, // 1 hour
    keyPrefix: cache?.keyPrefix ?? 'weather',
  }
}

/**
 * Get default settings merged with provided settings
 */
export function getDefaultSettings(
  settings?: PluginSettings,
): Required<PluginSettings> {
  return {
    logLevel: settings?.logLevel ?? 'warn',
    defaultForecastDays: settings?.defaultForecastDays ?? 3,
    locales: settings?.locales ?? ['en'],
  }
}

/**
 * Get default collections configuration
 */
export function getDefaultCollectionsConfig(
  collections?: WeatherPluginConfig['collections'],
): Required<NonNullable<WeatherPluginConfig['collections']>> {
  return {
    experiences: collections?.experiences ?? true,
    cities: collections?.cities ?? true,
  }
}
