/**
 * Weather Plugin for Payload CMS
 *
 * A provider-agnostic weather plugin with:
 * - Configurable weather providers (WeatherAPI.com, etc.)
 * - Redis caching with intelligent TTL
 * - REST API endpoints for weather data
 * - CMS blocks for pages
 * - Experience and city integration
 *
 * @example
 * ```typescript
 * // payload.config.ts
 * import { weatherPlugin } from './plugins/weather'
 *
 * export default buildConfig({
 *   plugins: [
 *     weatherPlugin({
 *       provider: {
 *         type: 'weatherapi',
 *         apiKey: process.env.WEATHER_API_KEY!,
 *       },
 *       cache: {
 *         currentWeatherTTL: 900,
 *         forecastTTL: 3600,
 *       },
 *     }),
 *   ],
 * })
 * ```
 */

import type { Config, Plugin } from 'payload'
import type { WeatherPluginConfig } from './types'
import { validateConfig } from './config'
import { createLogger } from '@/plugins/logging'
import { initializeService, getWeatherService, isServiceInitialized } from './service'
import {
  createCurrentWeatherEndpoint,
  createForecastEndpoint,
  createExperienceWeatherEndpoint,
  createCityWeatherEndpoint,
} from './endpoints'

const logger = createLogger('weather')

/**
 * Create the Weather plugin for Payload CMS
 *
 * @param config Plugin configuration
 * @returns Payload plugin
 */
export function weatherPlugin(config: WeatherPluginConfig): Plugin {
  // Validate config early
  validateConfig(config)

  return (incomingConfig: Config): Config => {
    // Initialize service singleton
    const service = initializeService(config)

    // Create API endpoints
    const weatherEndpoints = [
      createCurrentWeatherEndpoint(config),
      createForecastEndpoint(config),
      createExperienceWeatherEndpoint(config),
      createCityWeatherEndpoint(config),
    ]

    // Return modified config with endpoints and onInit handler
    return {
      ...incomingConfig,
      endpoints: [...(incomingConfig.endpoints || []), ...weatherEndpoints],
      onInit: async (payload) => {
        // Call existing onInit if present
        if (incomingConfig.onInit) {
          await incomingConfig.onInit(payload)
        }

        // Initialize service and set payload instance
        await service.initialize()
        service.setPayload(payload)

        // Test provider connection
        const health = await service.health()
        if (health.ok) {
          logger.info('Weather provider connection verified', {
            provider: health.provider,
          })
        } else {
          logger.warn('Weather provider connection failed', {
            provider: health.provider,
            error: health.error,
          })
        }

        logger.info('Weather plugin ready')
      },
    }
  }
}

// ==================== Public Exports ====================

// Service accessor
export { getWeatherService, isServiceInitialized }

// Types
export type {
  WeatherPluginConfig,
  WeatherProvider,
  WeatherProviderConfig,
  CacheConfig,
  PluginSettings,
  Coordinates,
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherData,
  WeatherCondition,
  UnitSystem,
  WeatherService,
  HealthStatus,
  ExperienceWeatherResponse,
  CityWeatherResponse,
  LocationSource,
  ForecastDisplayStyle,
  WidgetTheme,
} from './types'

// Service class
export { WeatherService as WeatherServiceClass } from './service'

// Providers
export { WeatherApiProvider, createWeatherApiProvider } from './providers'
export type { WeatherApiConfig } from './providers'

// Config utilities
export { validateConfig, getDefaultCacheConfig, getDefaultSettings, ConfigValidationError } from './config'

// Cache utilities
export { createCachedWeatherFetcher, getCacheKey } from './cache'
