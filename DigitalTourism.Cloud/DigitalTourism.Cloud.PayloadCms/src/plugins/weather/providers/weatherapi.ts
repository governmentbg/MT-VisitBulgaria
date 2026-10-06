/**
 * WeatherAPI.com Provider Implementation
 *
 * Implements the WeatherProvider interface for weatherapi.com
 * API Documentation: https://www.weatherapi.com/docs/
 */

import type {
  WeatherProvider,
  Coordinates,
  CurrentWeather,
  WeatherData,
  WeatherCondition,
  DailyForecast,
  HourlyForecast,
} from '../types'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('weather:weatherapi')

export interface WeatherApiConfig {
  apiKey: string
  baseUrl?: string
}

/**
 * WeatherAPI.com condition code to normalized condition mapping
 * Reference: https://www.weatherapi.com/docs/weather_conditions.json
 */
const CONDITION_MAP: Record<number, WeatherCondition> = {
  // Sunny / Clear
  1000: 'sunny', // Sunny / Clear

  // Partly Cloudy
  1003: 'partly_cloudy', // Partly cloudy

  // Cloudy
  1006: 'cloudy', // Cloudy
  1009: 'overcast', // Overcast

  // Mist / Fog
  1030: 'mist', // Mist
  1135: 'fog', // Fog
  1147: 'fog', // Freezing fog

  // Rain / Drizzle
  1063: 'light_rain', // Patchy rain possible
  1150: 'drizzle', // Patchy light drizzle
  1153: 'drizzle', // Light drizzle
  1168: 'drizzle', // Freezing drizzle
  1171: 'drizzle', // Heavy freezing drizzle
  1180: 'light_rain', // Patchy light rain
  1183: 'light_rain', // Light rain
  1186: 'rain', // Moderate rain at times
  1189: 'rain', // Moderate rain
  1192: 'heavy_rain', // Heavy rain at times
  1195: 'heavy_rain', // Heavy rain
  1198: 'light_rain', // Light freezing rain
  1201: 'rain', // Moderate or heavy freezing rain
  1240: 'light_rain', // Light rain shower
  1243: 'rain', // Moderate or heavy rain shower
  1246: 'heavy_rain', // Torrential rain shower

  // Snow
  1066: 'light_snow', // Patchy snow possible
  1069: 'sleet', // Patchy sleet possible
  1072: 'sleet', // Patchy freezing drizzle possible
  1114: 'snow', // Blowing snow
  1117: 'blizzard', // Blizzard
  1204: 'sleet', // Light sleet
  1207: 'sleet', // Moderate or heavy sleet
  1210: 'light_snow', // Patchy light snow
  1213: 'light_snow', // Light snow
  1216: 'snow', // Patchy moderate snow
  1219: 'snow', // Moderate snow
  1222: 'heavy_snow', // Patchy heavy snow
  1225: 'heavy_snow', // Heavy snow
  1237: 'sleet', // Ice pellets
  1249: 'sleet', // Light sleet showers
  1252: 'sleet', // Moderate or heavy sleet showers
  1255: 'light_snow', // Light snow showers
  1258: 'snow', // Moderate or heavy snow showers
  1261: 'sleet', // Light showers of ice pellets
  1264: 'sleet', // Moderate or heavy showers of ice pellets
  1279: 'snow', // Patchy light snow with thunder
  1282: 'heavy_snow', // Moderate or heavy snow with thunder

  // Thunderstorm
  1087: 'thunderstorm', // Thundery outbreaks possible
  1273: 'thunderstorm', // Patchy light rain with thunder
  1276: 'thunderstorm', // Moderate or heavy rain with thunder
}

/**
 * Map WeatherAPI.com condition code to normalized condition
 */
function mapCondition(code: number): WeatherCondition {
  return CONDITION_MAP[code] || 'unknown'
}

/**
 * Map wind direction degrees to cardinal direction
 */
function mapWindDirection(degree: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degree / 22.5) % 16
  return directions[index]
}

/**
 * WeatherAPI.com response types (partial, only what we use)
 */
interface WeatherApiLocation {
  name: string
  region: string
  country: string
  lat: number
  lon: number
  tz_id: string
  localtime: string
}

interface WeatherApiCondition {
  text: string
  icon: string
  code: number
}

interface WeatherApiCurrent {
  temp_c: number
  feelslike_c: number
  humidity: number
  wind_kph: number
  wind_degree: number
  condition: WeatherApiCondition
  uv: number
  vis_km: number
  pressure_mb: number
  precip_mm: number
  cloud: number
  last_updated: string
}

interface WeatherApiForecastDay {
  date: string
  day: {
    maxtemp_c: number
    mintemp_c: number
    avgtemp_c: number
    condition: WeatherApiCondition
    daily_chance_of_rain: number
    daily_chance_of_snow: number
    totalprecip_mm: number
    avghumidity: number
    maxwind_kph: number
    uv: number
  }
  astro: {
    sunrise: string
    sunset: string
  }
  hour: WeatherApiHour[]
}

interface WeatherApiHour {
  time: string
  temp_c: number
  feelslike_c: number
  condition: WeatherApiCondition
  chance_of_rain: number
  humidity: number
  wind_kph: number
  wind_degree: number
}

interface WeatherApiResponse {
  location: WeatherApiLocation
  current: WeatherApiCurrent
  forecast?: {
    forecastday: WeatherApiForecastDay[]
  }
}

/**
 * WeatherAPI.com provider implementation
 */
export class WeatherApiProvider implements WeatherProvider {
  readonly name = 'weatherapi'
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor(config: WeatherApiConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.weatherapi.com/v1'

    logger.debug('WeatherAPI provider initialized', {
      baseUrl: this.baseUrl,
    })
  }

  /**
   * Fetch current weather for coordinates
   */
  async getCurrentWeather(coords: Coordinates, locale = 'en'): Promise<CurrentWeather> {
    const url = new URL(`${this.baseUrl}/current.json`)
    url.searchParams.set('key', this.apiKey)
    url.searchParams.set('q', `${coords.latitude},${coords.longitude}`)
    url.searchParams.set('lang', locale)

    logger.debug('Fetching current weather', { coords, locale })

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorBody = await response.text()
      logger.error('WeatherAPI request failed', {
        status: response.status,
        body: errorBody,
      })
      throw new Error(`WeatherAPI request failed: ${response.status} ${response.statusText}`)
    }

    const data: WeatherApiResponse = await response.json()

    return this.mapCurrentWeather(data.current)
  }

  /**
   * Fetch weather with forecast
   */
  async getWeatherWithForecast(
    coords: Coordinates,
    days: number,
    locale = 'en',
  ): Promise<WeatherData> {
    // Clamp days to free tier limit (1-3)
    const clampedDays = Math.min(Math.max(days, 1), 3)

    const url = new URL(`${this.baseUrl}/forecast.json`)
    url.searchParams.set('key', this.apiKey)
    url.searchParams.set('q', `${coords.latitude},${coords.longitude}`)
    url.searchParams.set('days', String(clampedDays))
    url.searchParams.set('lang', locale)

    logger.debug('Fetching weather forecast', { coords, days: clampedDays, locale })

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorBody = await response.text()
      logger.error('WeatherAPI forecast request failed', {
        status: response.status,
        body: errorBody,
      })
      throw new Error(`WeatherAPI request failed: ${response.status} ${response.statusText}`)
    }

    const data: WeatherApiResponse = await response.json()

    return this.mapWeatherData(data, coords)
  }

  /**
   * Test provider connectivity
   */
  async testConnection(): Promise<{ ok: boolean; error?: string }> {
    try {
      // Use a known location for testing (London)
      const url = new URL(`${this.baseUrl}/current.json`)
      url.searchParams.set('key', this.apiKey)
      url.searchParams.set('q', '51.5,-0.1')

      const response = await fetch(url.toString())

      if (!response.ok) {
        const errorBody = await response.text()
        return {
          ok: false,
          error: `API returned ${response.status}: ${errorBody}`,
        }
      }

      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Map WeatherAPI current response to normalized CurrentWeather
   */
  private mapCurrentWeather(current: WeatherApiCurrent): CurrentWeather {
    return {
      temperature: current.temp_c,
      feelsLike: current.feelslike_c,
      humidity: current.humidity,
      windSpeed: current.wind_kph,
      windDirection: mapWindDirection(current.wind_degree),
      windDegree: current.wind_degree,
      condition: mapCondition(current.condition.code),
      conditionText: current.condition.text,
      icon: current.condition.icon.startsWith('//')
        ? `https:${current.condition.icon}`
        : current.condition.icon,
      uvIndex: current.uv,
      visibility: current.vis_km,
      pressure: current.pressure_mb,
      precipitation: current.precip_mm,
      cloudCover: current.cloud,
      lastUpdated: new Date(current.last_updated),
    }
  }

  /**
   * Map WeatherAPI response to normalized WeatherData
   */
  private mapWeatherData(data: WeatherApiResponse, coords: Coordinates): WeatherData {
    const result: WeatherData = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        coordinates: coords,
        timezone: data.location.tz_id,
        localTime: new Date(data.location.localtime),
      },
      current: this.mapCurrentWeather(data.current),
    }

    if (data.forecast?.forecastday) {
      result.forecast = {
        daily: data.forecast.forecastday.map((day): DailyForecast => ({
          date: new Date(day.date),
          tempMax: day.day.maxtemp_c,
          tempMin: day.day.mintemp_c,
          avgTemp: day.day.avgtemp_c,
          condition: mapCondition(day.day.condition.code),
          conditionText: day.day.condition.text,
          icon: day.day.condition.icon.startsWith('//')
            ? `https:${day.day.condition.icon}`
            : day.day.condition.icon,
          chanceOfRain: day.day.daily_chance_of_rain,
          chanceOfSnow: day.day.daily_chance_of_snow,
          totalPrecipitation: day.day.totalprecip_mm,
          avgHumidity: day.day.avghumidity,
          maxWindSpeed: day.day.maxwind_kph,
          uvIndex: day.day.uv,
          sunrise: day.astro.sunrise,
          sunset: day.astro.sunset,
        })),
        hourly: this.mapHourlyForecast(data.forecast.forecastday),
      }
    }

    return result
  }

  /**
   * Map hourly forecast data (next 24 hours from all forecast days)
   */
  private mapHourlyForecast(forecastDays: WeatherApiForecastDay[]): HourlyForecast[] {
    const now = new Date()
    const hourly: HourlyForecast[] = []

    for (const day of forecastDays) {
      for (const hour of day.hour) {
        const hourTime = new Date(hour.time)

        // Only include future hours, up to 24 hours
        if (hourTime > now && hourly.length < 24) {
          hourly.push({
            time: hourTime,
            temperature: hour.temp_c,
            feelsLike: hour.feelslike_c,
            condition: mapCondition(hour.condition.code),
            conditionText: hour.condition.text,
            icon: hour.condition.icon.startsWith('//')
              ? `https:${hour.condition.icon}`
              : hour.condition.icon,
            chanceOfRain: hour.chance_of_rain,
            humidity: hour.humidity,
            windSpeed: hour.wind_kph,
            windDirection: mapWindDirection(hour.wind_degree),
          })
        }
      }
    }

    return hourly
  }
}

/**
 * Create a WeatherAPI provider from environment variables
 */
export function createWeatherApiProvider(apiKey?: string): WeatherApiProvider {
  const key = apiKey || process.env.WEATHER_API_KEY

  if (!key) {
    throw new Error('WEATHER_API_KEY environment variable is required')
  }

  return new WeatherApiProvider({ apiKey: key })
}
