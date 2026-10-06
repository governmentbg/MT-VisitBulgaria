/**
 * Weather API Endpoints
 *
 * Custom Payload CMS endpoints for weather data.
 */

import type { Endpoint, PayloadRequest } from 'payload'
import type { WeatherPluginConfig } from './types'
import { getWeatherService } from './service'
import { createLogger } from '@/plugins/logging'
import type { ExperienceSlug } from '@/collections/Experiences/constants'

const logger = createLogger('weather:endpoints')

/**
 * Parse and validate coordinate parameters
 */
function parseCoordinates(url: URL): { latitude: number; longitude: number } | null {
  const lat = parseFloat(url.searchParams.get('lat') || '')
  const lng = parseFloat(url.searchParams.get('lng') || '')

  if (isNaN(lat) || isNaN(lng)) {
    return null
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null
  }

  return { latitude: lat, longitude: lng }
}

/**
 * Create current weather endpoint
 *
 * GET /api/weather/current?lat={lat}&lng={lng}&locale={locale}
 * Returns current weather conditions for specified coordinates
 */
export function createCurrentWeatherEndpoint(_: WeatherPluginConfig): Endpoint {
  return {
    path: '/weather/current',
    method: 'get',
    handler: async (req: PayloadRequest) => {
      const url = new URL(req.url || '', 'http://localhost')
      const locale = url.searchParams.get('locale') || req.locale || 'en'

      try {
        const coords = parseCoordinates(url)

        if (!coords) {
          return Response.json(
            {
              error:
                'Invalid coordinates. Provide valid lat (-90 to 90) and lng (-180 to 180) query parameters.',
            },
            { status: 400 },
          )
        }

        const service = getWeatherService()
        const weather = await service.getCurrentWeather(coords, locale)

        if (!weather) {
          return Response.json(
            { error: 'Failed to fetch weather data. Please try again later.' },
            { status: 503 },
          )
        }

        return Response.json(weather, { status: 200 })
      } catch (error) {
        logger.error('Current weather endpoint error', {
          error: error instanceof Error ? error.message : String(error),
        })
        return Response.json({ error: 'Internal server error' }, { status: 500 })
      }
    },
  }
}

/**
 * Create forecast endpoint
 *
 * GET /api/weather/forecast?lat={lat}&lng={lng}&days={days}&locale={locale}
 * Returns weather forecast for specified coordinates
 * Note: days is clamped to 1-3 for free tier
 */
export function createForecastEndpoint(_: WeatherPluginConfig): Endpoint {
  return {
    path: '/weather/forecast',
    method: 'get',
    handler: async (req: PayloadRequest) => {
      const url = new URL(req.url || '', 'http://localhost')
      const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '3', 10), 1), 3)
      const locale = url.searchParams.get('locale') || req.locale || 'en'

      try {
        const coords = parseCoordinates(url)

        if (!coords) {
          return Response.json(
            {
              error:
                'Invalid coordinates. Provide valid lat (-90 to 90) and lng (-180 to 180) query parameters.',
            },
            { status: 400 },
          )
        }

        const service = getWeatherService()
        const weather = await service.getWeatherWithForecast(coords, days, locale)

        if (!weather) {
          return Response.json(
            { error: 'Failed to fetch weather forecast. Please try again later.' },
            { status: 503 },
          )
        }

        return Response.json(weather, { status: 200 })
      } catch (error) {
        logger.error('Forecast endpoint error', {
          error: error instanceof Error ? error.message : String(error),
        })
        return Response.json({ error: 'Internal server error' }, { status: 500 })
      }
    },
  }
}

/**
 * Create experience weather endpoint
 *
 * GET /api/weather/experience/:id?days={days}&locale={locale}
 * Returns weather for an experience's city location
 */
export function createExperienceWeatherEndpoint(_: WeatherPluginConfig): Endpoint {
  return {
    path: '/weather/experience/:id',
    method: 'get',
    handler: async (req: PayloadRequest) => {
      const { id } = req.routeParams || {}
      const url = new URL(req.url || '', 'http://localhost')
      const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '3', 10), 1), 3)
      const locale = url.searchParams.get('locale') || req.locale || 'en'
      const collection = url.searchParams.get('collection') || 'hotels'

      if (!id) {
        return Response.json({ error: 'Experience ID is required' }, { status: 400 })
      }

      try {
        const service = getWeatherService()

        // Ensure service has payload instance from request
        if (req.payload) {
          service.setPayload(req.payload)
        }

        const weather = await service.getWeatherForExperience(id as string, days, locale, collection as ExperienceSlug)

        if (!weather) {
          return Response.json(
            {
              error:
                'Failed to fetch weather for experience. The experience may not exist or have a valid city with coordinates.',
            },
            { status: 404 },
          )
        }

        return Response.json(
          {
            experienceId: id,
            ...weather,
          },
          { status: 200 },
        )
      } catch (error) {
        logger.error('Experience weather endpoint error', {
          experienceId: id,
          error: error instanceof Error ? error.message : String(error),
        })
        return Response.json({ error: 'Internal server error' }, { status: 500 })
      }
    },
  }
}

/**
 * Create city weather endpoint
 *
 * GET /api/weather/city/:id?days={days}&locale={locale}
 * Returns weather for a city by its ID
 */
export function createCityWeatherEndpoint(_: WeatherPluginConfig): Endpoint {
  return {
    path: '/weather/city/:id',
    method: 'get',
    handler: async (req: PayloadRequest) => {
      const { id } = req.routeParams || {}
      const url = new URL(req.url || '', 'http://localhost')
      const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '3', 10), 1), 3)
      const locale = url.searchParams.get('locale') || req.locale || 'en'

      if (!id) {
        return Response.json({ error: 'City ID is required' }, { status: 400 })
      }

      try {
        const service = getWeatherService()

        // Ensure service has payload instance from request
        if (req.payload) {
          service.setPayload(req.payload)
        }

        const weather = await service.getWeatherForCity(id as string, days, locale)

        if (!weather) {
          return Response.json(
            {
              error:
                'Failed to fetch weather for city. The city may not exist or have valid coordinates.',
            },
            { status: 404 },
          )
        }

        return Response.json(
          {
            cityId: id,
            ...weather,
          },
          { status: 200 },
        )
      } catch (error) {
        logger.error('City weather endpoint error', {
          cityId: id,
          error: error instanceof Error ? error.message : String(error),
        })
        return Response.json({ error: 'Internal server error' }, { status: 500 })
      }
    },
  }
}

/**
 * Create all weather endpoints
 *
 * @param config - Weather plugin configuration
 * @returns Array of Payload endpoints
 */
export function createWeatherEndpoints(config: WeatherPluginConfig): Endpoint[] {
  return [
    createCurrentWeatherEndpoint(config),
    createForecastEndpoint(config),
    createExperienceWeatherEndpoint(config),
    createCityWeatherEndpoint(config),
  ]
}
