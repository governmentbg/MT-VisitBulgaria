/**
 * Weather Plugin - Type Definitions
 *
 * Provider-agnostic weather data types and plugin configuration.
 * Supports swappable weather providers (WeatherAPI.com, OpenWeatherMap, etc.)
 */

import { ExperienceSlug } from '@/collections/Experiences/constants'
import type { Plugin } from 'payload'

// =============================================================================
// CORE DATA TYPES
// =============================================================================

/**
 * Geographic coordinates for location-based weather lookups
 */
export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Normalized weather condition codes
 * Mapped from provider-specific codes to a common set
 */
export type WeatherCondition =
  | 'sunny'
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'overcast'
  | 'mist'
  | 'fog'
  | 'rain'
  | 'light_rain'
  | 'heavy_rain'
  | 'drizzle'
  | 'snow'
  | 'light_snow'
  | 'heavy_snow'
  | 'sleet'
  | 'thunderstorm'
  | 'blizzard'
  | 'unknown'

/**
 * Unit system for measurements
 */
export type UnitSystem = 'metric' | 'imperial'

/**
 * Current weather conditions (normalized across providers)
 */
export interface CurrentWeather {
  /** Temperature in Celsius */
  temperature: number

  /** Feels-like temperature in Celsius */
  feelsLike: number

  /** Relative humidity percentage (0-100) */
  humidity: number

  /** Wind speed in km/h */
  windSpeed: number

  /** Wind direction (N, NE, E, SE, S, SW, W, NW) */
  windDirection: string

  /** Wind direction in degrees (0-360) */
  windDegree: number

  /** Normalized condition code */
  condition: WeatherCondition

  /** Localized condition description */
  conditionText: string

  /** Weather icon URL from provider */
  icon: string

  /** UV index (0-11+) */
  uvIndex: number

  /** Visibility in km */
  visibility: number

  /** Atmospheric pressure in hPa (mbar) */
  pressure: number

  /** Precipitation in mm */
  precipitation: number

  /** Cloud cover percentage (0-100) */
  cloudCover: number

  /** Last update timestamp from provider */
  lastUpdated: Date
}

/**
 * Daily forecast data
 */
export interface DailyForecast {
  /** Forecast date */
  date: Date

  /** Maximum temperature in Celsius */
  tempMax: number

  /** Minimum temperature in Celsius */
  tempMin: number

  /** Average temperature in Celsius */
  avgTemp: number

  /** Normalized condition code */
  condition: WeatherCondition

  /** Localized condition description */
  conditionText: string

  /** Weather icon URL */
  icon: string

  /** Chance of rain percentage (0-100) */
  chanceOfRain: number

  /** Chance of snow percentage (0-100) */
  chanceOfSnow: number

  /** Total precipitation in mm */
  totalPrecipitation: number

  /** Average humidity percentage */
  avgHumidity: number

  /** Maximum wind speed in km/h */
  maxWindSpeed: number

  /** UV index */
  uvIndex: number

  /** Sunrise time (HH:mm format in local time) */
  sunrise: string

  /** Sunset time (HH:mm format in local time) */
  sunset: string
}

/**
 * Hourly forecast data
 */
export interface HourlyForecast {
  /** Forecast timestamp */
  time: Date

  /** Temperature in Celsius */
  temperature: number

  /** Feels-like temperature in Celsius */
  feelsLike: number

  /** Normalized condition code */
  condition: WeatherCondition

  /** Localized condition description */
  conditionText: string

  /** Weather icon URL */
  icon: string

  /** Chance of rain percentage */
  chanceOfRain: number

  /** Humidity percentage */
  humidity: number

  /** Wind speed in km/h */
  windSpeed: number

  /** Wind direction */
  windDirection: string
}

/**
 * Complete weather response with location, current, and forecast data
 */
export interface WeatherData {
  /** Location information from provider */
  location: {
    /** City/location name */
    name: string

    /** Region/state */
    region: string

    /** Country */
    country: string

    /** Coordinates used for lookup */
    coordinates: Coordinates

    /** Timezone identifier (e.g., "Europe/Sofia") */
    timezone: string

    /** Current local time at location */
    localTime: Date
  }

  /** Current weather conditions */
  current: CurrentWeather

  /** Forecast data (optional, based on request) */
  forecast?: {
    /** Daily forecasts (max 3 days on free tier) */
    daily: DailyForecast[]

    /** Hourly forecasts (optional, next 24h) */
    hourly?: HourlyForecast[]
  }
}

// =============================================================================
// PROVIDER INTERFACE
// =============================================================================

/**
 * Weather provider interface - implement this to add new providers
 *
 * @example
 * ```typescript
 * class OpenWeatherMapProvider implements WeatherProvider {
 *   readonly name = 'openweathermap'
 *   // ... implement methods
 * }
 * ```
 */
export interface WeatherProvider {
  /** Unique provider identifier */
  readonly name: string

  /**
   * Fetch current weather for coordinates
   * @param coords Location coordinates
   * @param locale Language code for condition descriptions (e.g., 'en', 'bg')
   */
  getCurrentWeather(coords: Coordinates, locale?: string): Promise<CurrentWeather>

  /**
   * Fetch weather with forecast
   * @param coords Location coordinates
   * @param days Number of forecast days (max 3 for free tier)
   * @param locale Language code
   */
  getWeatherWithForecast(
    coords: Coordinates,
    days: number,
    locale?: string
  ): Promise<WeatherData>

  /**
   * Test provider connectivity and API key validity
   */
  testConnection(): Promise<{ ok: boolean; error?: string }>
}

// =============================================================================
// PLUGIN CONFIGURATION
// =============================================================================

/**
 * Built-in provider configuration (alternative to passing provider instance)
 */
export interface WeatherProviderConfig {
  /** Provider type */
  type: 'weatherapi' | 'openweathermap'

  /** API key for the provider */
  apiKey: string

  /** Provider-specific options */
  options?: Record<string, unknown>
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /** TTL for current weather in seconds (default: 900 = 15 min) */
  currentWeatherTTL?: number

  /** TTL for forecast data in seconds (default: 3600 = 1 hour) */
  forecastTTL?: number

  /** Redis/cache key prefix (default: 'weather') */
  keyPrefix?: string
}

/**
 * Plugin settings
 */
export interface PluginSettings {
  /** Log level (default: 'warn') */
  logLevel?: 'debug' | 'info' | 'warn' | 'error'

  /** Default forecast days (max 3 for free tier) */
  defaultForecastDays?: number

  /** Supported locales for weather descriptions */
  locales?: string[]
}

/**
 * Main plugin configuration
 */
export interface WeatherPluginConfig {
  /** Weather provider instance or configuration */
  provider: WeatherProvider | WeatherProviderConfig

  /** Cache settings */
  cache?: CacheConfig

  /** Collection integrations */
  collections?: {
    /** Enable weather for experiences (default: true) */
    experiences?: boolean

    /** Enable weather for cities (default: true) */
    cities?: boolean
  }

  /** Plugin settings */
  settings?: PluginSettings
}

// =============================================================================
// SERVICE TYPES
// =============================================================================

/**
 * Cached weather fetcher interface
 */
export interface CachedWeatherFetcher {
  /**
   * Get current weather with caching
   */
  getCurrentWeather(coords: Coordinates, locale?: string): Promise<CurrentWeather | null>

  /**
   * Get weather with forecast with caching
   */
  getWeatherWithForecast(
    coords: Coordinates,
    days: number,
    locale?: string
  ): Promise<WeatherData | null>
}

/**
 * Weather service interface (accessible via getWeatherService)
 */
export interface WeatherService {
  /**
   * Get current weather for coordinates
   */
  getCurrentWeather(coords: Coordinates, locale?: string): Promise<CurrentWeather | null>

  /**
   * Get weather with forecast for coordinates
   */
  getWeatherWithForecast(
    coords: Coordinates,
    days?: number,
    locale?: string
  ): Promise<WeatherData | null>

  /**
   * Get weather for an experience by ID
   */
  getWeatherForExperience(
    experienceId: string,
    days?: number,
    locale?: string,
    collection?: ExperienceSlug
  ): Promise<WeatherData | null>

  /**
   * Get weather for a city by ID
   */
  getWeatherForCity(
    cityId: string,
    days?: number,
    locale?: string
  ): Promise<WeatherData | null>

  /**
   * Initialize the service (called during plugin onInit)
   */
  initialize(): Promise<void>

  /**
   * Health check - test provider connectivity
   */
  health(): Promise<HealthStatus>
}

/**
 * Health status response
 */
export interface HealthStatus {
  ok: boolean
  provider: string
  error?: string
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Experience weather response (includes experience context)
 */
export interface ExperienceWeatherResponse extends WeatherData {
  experienceId: string
  cityName: string
}

/**
 * City weather response (includes city context)
 */
export interface CityWeatherResponse extends WeatherData {
  cityId: string
  cityName: string
}

/**
 * API error response
 */
export interface WeatherApiError {
  error: string
  code?: string
}

// =============================================================================
// BLOCK TYPES
// =============================================================================

/**
 * Location source for weather blocks
 */
export type LocationSource = 'city' | 'custom'

/**
 * Current Weather block data
 */
export interface CurrentWeatherBlockData {
  title?: string
  locationSource: LocationSource
  city?: string | { id: string; coordinates?: Coordinates; name?: string }
  customLocation?: {
    name: string
    latitude: number
    longitude: number
  }
  displayOptions?: {
    showHumidity?: boolean
    showWind?: boolean
    showFeelsLike?: boolean
    showUVIndex?: boolean
    compactView?: boolean
  }
}

/**
 * Forecast block display style
 */
export type ForecastDisplayStyle = 'cards' | 'list' | 'compact'

/**
 * Weather Forecast block data
 */
export interface WeatherForecastBlockData {
  title?: string
  locationSource: LocationSource
  city?: string | { id: string; coordinates?: Coordinates; name?: string }
  customLocation?: {
    name: string
    latitude: number
    longitude: number
  }
  forecastDays?: '3'
  displayStyle?: ForecastDisplayStyle
  showHourly?: boolean
}

/**
 * Widget theme options
 */
export type WidgetTheme = 'auto' | 'light' | 'dark'

/**
 * Weather Widget block data
 */
export interface WeatherWidgetBlockData {
  locationSource: LocationSource
  city?: string | { id: string; coordinates?: Coordinates; name?: string }
  customLocation?: {
    name: string
    latitude: number
    longitude: number
  }
  showMiniforecast?: boolean
  theme?: WidgetTheme
}

// =============================================================================
// PLUGIN FACTORY
// =============================================================================

/**
 * Plugin factory function type
 */
export type WeatherPluginFactory = (config: WeatherPluginConfig) => Plugin
