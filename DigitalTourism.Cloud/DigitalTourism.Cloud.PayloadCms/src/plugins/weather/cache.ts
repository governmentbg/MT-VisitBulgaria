/**
 * Caching utilities for Weather plugin
 *
 * Uses Next.js unstable_cache with Redis backend for distributed caching
 */

import { unstable_cache } from 'next/cache'

import type {
  WeatherProvider,
  Coordinates,
  CurrentWeather,
  WeatherData,
  CachedWeatherFetcher,
  CacheConfig,
} from './types'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('weather:cache')

/**
 * Round coordinates to ~1km precision for cache key generation
 * This allows nearby locations to share cache entries
 *
 * 2 decimal places = ~1.1km precision at the equator
 * This is a good balance between cache hit rate and accuracy
 */
function roundCoordinates(lat: number, lng: number): string {
  const roundedLat = Math.round(lat * 100) / 100
  const roundedLng = Math.round(lng * 100) / 100
  return `${roundedLat},${roundedLng}`
}

/**
 * Generate cache key components for weather data
 */
function getCacheKeyParts(
  prefix: string,
  type: 'current' | 'forecast',
  coords: Coordinates,
  locale: string,
  days?: number,
): string[] {
  const coordKey = roundCoordinates(coords.latitude, coords.longitude)
  const parts = [prefix, type, coordKey, locale]
  if (days !== undefined) {
    parts.push(String(days))
  }
  return parts
}

/**
 * Generate cache tags for weather data
 */
function getCacheTags(
  prefix: string,
  type: 'current' | 'forecast',
  coords: Coordinates,
): string[] {
  const coordKey = roundCoordinates(coords.latitude, coords.longitude)
  return [`${prefix}:${type}`, `${prefix}:${coordKey}`]
}

export interface CacheConfigWithDefaults {
  currentWeatherTTL: number
  forecastTTL: number
  keyPrefix: string
}

const DEFAULT_CACHE_CONFIG: CacheConfigWithDefaults = {
  currentWeatherTTL: 900, // 15 minutes
  forecastTTL: 3600, // 1 hour
  keyPrefix: 'weather',
}

/**
 * Create a cached weather fetcher that wraps provider calls with caching
 *
 * @param provider The weather provider to use for fetching
 * @param config Cache configuration options
 * @returns A CachedWeatherFetcher instance
 *
 * @example
 * ```typescript
 * const fetcher = createCachedWeatherFetcher(provider, { currentWeatherTTL: 600 })
 * const weather = await fetcher.getCurrentWeather({ latitude: 42.7, longitude: 23.3 })
 * ```
 */
export function createCachedWeatherFetcher(
  provider: WeatherProvider,
  config?: Partial<CacheConfig>,
): CachedWeatherFetcher {
  const cfg: CacheConfigWithDefaults = {
    ...DEFAULT_CACHE_CONFIG,
    ...config,
  }

  logger.debug('Creating cached weather fetcher', {
    provider: provider.name,
    currentWeatherTTL: cfg.currentWeatherTTL,
    forecastTTL: cfg.forecastTTL,
  })

  /**
   * Get current weather with caching
   */
  const getCurrentWeather = async (
    coords: Coordinates,
    locale = 'en',
  ): Promise<CurrentWeather | null> => {
    const keyParts = getCacheKeyParts(cfg.keyPrefix, 'current', coords, locale)
    const tags = getCacheTags(cfg.keyPrefix, 'current', coords)

    const cachedFetcher = unstable_cache(
      async (): Promise<CurrentWeather | null> => {
        try {
          logger.debug('Fetching current weather from provider', {
            provider: provider.name,
            coords,
            locale,
          })

          const weather = await provider.getCurrentWeather(coords, locale)

          logger.debug('Successfully fetched current weather', {
            provider: provider.name,
            temperature: weather.temperature,
            condition: weather.condition,
          })

          return weather
        } catch (error) {
          logger.error('Failed to fetch current weather', {
            provider: provider.name,
            coords,
            error: error instanceof Error ? error.message : String(error),
          })
          return null
        }
      },
      keyParts,
      {
        revalidate: cfg.currentWeatherTTL,
        tags,
      },
    )

    return cachedFetcher()
  }

  /**
   * Get weather with forecast with caching
   */
  const getWeatherWithForecast = async (
    coords: Coordinates,
    days: number,
    locale = 'en',
  ): Promise<WeatherData | null> => {
    // Clamp days to free tier limit
    const clampedDays = Math.min(Math.max(days, 1), 3)

    const keyParts = getCacheKeyParts(cfg.keyPrefix, 'forecast', coords, locale, clampedDays)
    const tags = getCacheTags(cfg.keyPrefix, 'forecast', coords)

    const cachedFetcher = unstable_cache(
      async (): Promise<WeatherData | null> => {
        try {
          logger.debug('Fetching weather forecast from provider', {
            provider: provider.name,
            coords,
            days: clampedDays,
            locale,
          })

          const weather = await provider.getWeatherWithForecast(coords, clampedDays, locale)

          logger.debug('Successfully fetched weather forecast', {
            provider: provider.name,
            location: weather.location.name,
            forecastDays: weather.forecast?.daily.length,
          })

          return weather
        } catch (error) {
          logger.error('Failed to fetch weather forecast', {
            provider: provider.name,
            coords,
            error: error instanceof Error ? error.message : String(error),
          })
          return null
        }
      },
      keyParts,
      {
        revalidate: cfg.forecastTTL,
        tags,
      },
    )

    return cachedFetcher()
  }

  return {
    getCurrentWeather,
    getWeatherWithForecast,
  }
}

/**
 * Create cache key for a specific coordinate
 * Useful for debugging and cache invalidation
 */
export function getCacheKey(coords: Coordinates): string {
  return roundCoordinates(coords.latitude, coords.longitude)
}
