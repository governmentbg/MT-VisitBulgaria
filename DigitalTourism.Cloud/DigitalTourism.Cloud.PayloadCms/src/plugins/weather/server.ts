/**
 * Server-side Weather Data Fetching
 *
 * These functions are designed for use in React Server Components.
 * They fetch weather data directly from the service with proper caching.
 */

import { getPayloadClient } from '@/payload/payloadClient'
import { unstable_cache as _unstable_cache } from 'next/cache'
import type { Coordinates, WeatherData, CurrentWeather, UnitSystem as _UnitSystem } from './types'
import { getWeatherService, isServiceInitialized } from './service'
import { createLogger } from '@/plugins/logging'
import { ExperienceSlug } from '@/collections/Experiences/constants'

const logger = createLogger('weather:server')

/**
 * Get weather data for coordinates (server-side)
 *
 * Uses Next.js unstable_cache for request deduplication and caching.
 */
export async function getWeatherByCoordinates(
  coords: Coordinates,
  days = 3,
  locale = 'en',
): Promise<WeatherData | null> {
  try {
    if (!isServiceInitialized()) {
      logger.warn('Weather service not initialized')
      return null
    }

    const service = getWeatherService()
    return await service.getWeatherWithForecast(coords, days, locale)
  } catch (error) {
    logger.error('Failed to fetch weather by coordinates', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

/**
 * Get current weather for coordinates (server-side)
 */
export async function getCurrentWeatherByCoordinates(
  coords: Coordinates,
  locale = 'en',
): Promise<CurrentWeather | null> {
  try {
    if (!isServiceInitialized()) {
      logger.warn('Weather service not initialized')
      return null
    }

    const service = getWeatherService()
    return await service.getCurrentWeather(coords, locale)
  } catch (error) {
    logger.error('Failed to fetch current weather', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

/**
 * Get weather data for an experience (server-side)
 *
 * Fetches the experience's city and returns weather for that location.
 */
export async function getWeatherForExperience(
  experienceId: string,
  days = 3,
  locale = 'en',
  collection: ExperienceSlug,
): Promise<WeatherData | null> {
  try {
    const payload = await getPayloadClient()

    // Fetch experience with city populated
    const experience = await payload.findByID({
      collection: collection as any,
      id: experienceId,
      depth: 2,
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

    const weather = await getWeatherByCoordinates(coords, days, locale)

    if (weather) {
      // Override location name with city name for better UX
      weather.location.name = city.name || weather.location.name
    }

    return weather
  } catch (error) {
    logger.error('Failed to fetch weather for experience', {
      experienceId,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

/**
 * Get weather data for a city (server-side)
 */
export async function getWeatherForCity(
  cityId: string,
  days = 3,
  locale = 'en',
): Promise<WeatherData | null> {
  try {
    const payload = await getPayloadClient()

    const city = await payload.findByID({
      collection: 'cities',
      id: cityId,
      locale: locale as any,
    })

    if (!city) {
      logger.warn('City not found', { cityId })
      return null
    }

    const coordinates = city.coordinates as any
    if (!coordinates?.latitude || !coordinates?.longitude) {
      logger.warn('City has no coordinates', { cityId })
      return null
    }

    const coords: Coordinates = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }

    const weather = await getWeatherByCoordinates(coords, days, locale)

    if (weather) {
      weather.location.name = (city as any).name || weather.location.name
    }

    return weather
  } catch (error) {
    logger.error('Failed to fetch weather for city', {
      cityId,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

// ==================== Unit Conversion Utilities ====================
// Re-export from utils for backwards compatibility
export { convertTemperature, getTemperatureUnit, convertWindSpeed, getWindSpeedUnit } from './utils'
