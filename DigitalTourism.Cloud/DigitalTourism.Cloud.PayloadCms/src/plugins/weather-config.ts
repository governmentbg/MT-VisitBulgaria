/**
 * Weather Plugin Configuration
 *
 * Configures the weather plugin with weatherapi.com as the default provider.
 * API key should be set via WEATHER_API_KEY environment variable.
 * Plugin is disabled if no API key is provided.
 */

import type { Plugin } from 'payload'
import { weatherPlugin } from './weather'
import { LOCALE_CODES } from '@/i18n/localization'

const WEATHER_API_KEY = process.env.WEATHER_API_KEY

// Only enable plugin if API key is configured
export const weather: Plugin | null = WEATHER_API_KEY
  ? weatherPlugin({
      provider: {
        type: 'weatherapi',
        apiKey: WEATHER_API_KEY,
      },
      cache: {
        currentWeatherTTL: 900, // 15 minutes
        forecastTTL: 3600, // 1 hour
        keyPrefix: 'weather',
      },
      collections: {
        experiences: true,
        cities: true,
      },
      settings: {
        logLevel: 'info',
        defaultForecastDays: 3, // Free tier limit
        locales: [...LOCALE_CODES],
      },
    })
  : null
