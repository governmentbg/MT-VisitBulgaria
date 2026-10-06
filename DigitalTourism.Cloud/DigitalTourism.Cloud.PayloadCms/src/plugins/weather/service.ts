/**
 * WeatherService - Main entry point for all weather operations
 *
 * Provides a unified interface for:
 * - Current weather and forecast fetching
 * - Experience and city weather integration
 * - Health monitoring
 */

import type { Payload } from 'payload'
import type {
  WeatherPluginConfig,
  WeatherProvider,
  WeatherProviderConfig,
  WeatherService as IWeatherService,
  Coordinates,
  CurrentWeather,
  WeatherData,
  HealthStatus,
  CachedWeatherFetcher,
} from './types'
import { validateConfig, getDefaultCacheConfig } from './config'
import { createLogger } from '@/plugins/logging'
import { createCachedWeatherFetcher } from './cache'
import { WeatherApiProvider } from './providers/weatherapi'
import { ExperienceSlug } from '@/collections/Experiences/constants'

const logger = createLogger('weather:service')

/**
 * WeatherService - main entry point for all weather operations
 *
 * @example
 * ```typescript
 * const service = getWeatherService()
 *
 * // Get current weather
 * const weather = await service.getCurrentWeather({ latitude: 42.7, longitude: 23.3 })
 *
 * // Get weather for an experience
 * const expWeather = await service.getWeatherForExperience('experience-id')
 *
 * // Health check
 * const health = await service.health()
 * ```
 */
export class WeatherService implements IWeatherService {
  private config: WeatherPluginConfig
  private provider: WeatherProvider
  private fetcher: CachedWeatherFetcher
  private initialized = false
  private payload: Payload | null = null

  constructor(config: WeatherPluginConfig) {
    this.config = config
    this.provider = this.createProvider(config.provider)
    this.fetcher = createCachedWeatherFetcher(this.provider, getDefaultCacheConfig(config.cache))
  }

  /**
   * Create provider instance from config
   */
  private createProvider(providerConfig: WeatherProvider | WeatherProviderConfig): WeatherProvider {
    // If it's already a provider instance, use it directly
    if ('name' in providerConfig && typeof providerConfig.getCurrentWeather === 'function') {
      return providerConfig as WeatherProvider
    }

    // Create provider from config
    const config = providerConfig as WeatherProviderConfig

    switch (config.type) {
      case 'weatherapi':
        return new WeatherApiProvider({ apiKey: config.apiKey })

      case 'openweathermap':
        // TODO: Implement OpenWeatherMap provider
        throw new Error('OpenWeatherMap provider not yet implemented')

      default:
        throw new Error(`Unknown provider type: ${(config as any).type}`)
    }
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    // Validate configuration
    validateConfig(this.config)

    this.initialized = true
    logger.info('WeatherService initialized', { provider: this.provider.name })
  }

  /**
   * Set the Payload instance for database access
   */
  setPayload(payload: Payload): void {
    this.payload = payload
  }

  /**
   * Get the Payload instance
   */
  private getPayload(): Payload {
    if (!this.payload) {
      throw new Error('Payload not set. Call setPayload() first.')
    }
    return this.payload
  }

  // ==================== Weather Operations ====================

  /**
   * Get current weather for coordinates
   */
  async getCurrentWeather(coords: Coordinates, locale = 'en'): Promise<CurrentWeather | null> {
    return this.fetcher.getCurrentWeather(coords, locale)
  }

  /**
   * Get weather with forecast for coordinates
   */
  async getWeatherWithForecast(
    coords: Coordinates,
    days = 3,
    locale = 'en',
  ): Promise<WeatherData | null> {
    // Clamp to free tier limit
    const clampedDays = Math.min(Math.max(days, 1), 3)
    return this.fetcher.getWeatherWithForecast(coords, clampedDays, locale)
  }

  /**
   * Get weather for an experience by ID
   * Fetches the experience's city coordinates and returns weather data
   */
  async getWeatherForExperience(
    experienceId: string,
    days = 3,
    locale = 'en',
    collection: ExperienceSlug,
  ): Promise<WeatherData | null> {
    try {
      const payload = this.getPayload()

      // Fetch experience with city populated
      const experience = await payload.findByID({
        collection: collection,
        id: experienceId,
        depth: 2, // Populate city
        locale: locale as any,
      })

      if (!experience) {
        logger.warn('Experience not found', { experienceId })
        return null
      }

      // Extract coordinates from city
      const city = experience.city as any
      if (!city?.coordinates?.latitude || !city?.coordinates?.longitude) {
        logger.warn('Experience city has no coordinates', {
          experienceId,
          cityId: typeof city === 'string' ? city : city?.id,
        })
        return null
      }

      const coords: Coordinates = {
        latitude: city.coordinates.latitude,
        longitude: city.coordinates.longitude,
      }

      const weather = await this.getWeatherWithForecast(coords, days, locale)

      if (weather) {
        // Override location name with city name for better UX
        weather.location.name = city.name || weather.location.name
      }

      return weather
    } catch (error) {
      logger.error('Failed to get weather for experience', {
        experienceId,
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  /**
   * Get weather for a city by ID
   */
  async getWeatherForCity(cityId: string, days = 3, locale = 'en'): Promise<WeatherData | null> {
    try {
      const payload = this.getPayload()

      // Fetch city
      const city = await payload.findByID({
        collection: 'cities',
        id: cityId,
        locale: locale as any,
      })

      if (!city) {
        logger.warn('City not found', { cityId })
        return null
      }

      // Extract coordinates
      const coordinates = city.coordinates as any
      if (!coordinates?.latitude || !coordinates?.longitude) {
        logger.warn('City has no coordinates', { cityId })
        return null
      }

      const coords: Coordinates = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }

      const weather = await this.getWeatherWithForecast(coords, days, locale)

      if (weather) {
        // Override location name with city name
        weather.location.name = (city as any).name || weather.location.name
      }

      return weather
    } catch (error) {
      logger.error('Failed to get weather for city', {
        cityId,
        error: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  // ==================== Health & Status ====================

  /**
   * Check service health
   */
  async health(): Promise<HealthStatus> {
    try {
      const result = await this.provider.testConnection()
      return {
        ok: result.ok,
        provider: this.provider.name,
        error: result.error,
      }
    } catch (error) {
      return {
        ok: false,
        provider: this.provider.name,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Get the weather provider name
   */
  getProviderName(): string {
    return this.provider.name
  }
}

// ==================== Singleton Instance ====================

let serviceInstance: WeatherService | null = null

/**
 * Initialize the WeatherService singleton
 */
export function initializeService(config: WeatherPluginConfig): WeatherService {
  if (serviceInstance) {
    logger.warn('WeatherService already initialized, replacing')
  }

  serviceInstance = new WeatherService(config)
  return serviceInstance
}

/**
 * Get the WeatherService singleton
 *
 * @throws Error if service not initialized
 */
export function getWeatherService(): WeatherService {
  if (!serviceInstance) {
    throw new Error(
      'WeatherService not initialized. Ensure weatherPlugin() is configured in your Payload config.',
    )
  }
  return serviceInstance
}

/**
 * Check if the service is initialized
 */
export function isServiceInitialized(): boolean {
  return serviceInstance !== null
}

/**
 * Reset the service (useful for testing)
 */
export function resetService(): void {
  serviceInstance = null
}
