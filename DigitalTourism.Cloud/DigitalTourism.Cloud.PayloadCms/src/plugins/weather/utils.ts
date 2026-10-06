import type { UnitSystem } from './types'

/**
 * Convert temperature based on unit system
 */
export function convertTemperature(celsius: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32)
  }
  return Math.round(celsius)
}

/**
 * Get temperature unit string
 */
export function getTemperatureUnit(unit: UnitSystem): string {
  return unit === 'imperial' ? '°F' : '°C'
}

/**
 * Convert wind speed based on unit system
 */
export function convertWindSpeed(kmh: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round(kmh * 0.621371)
  }
  return Math.round(kmh)
}

/**
 * Get wind speed unit string
 */
export function getWindSpeedUnit(unit: UnitSystem): string {
  return unit === 'imperial' ? 'mph' : 'km/h'
}
