'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import type { UnitSystem, CurrentWeather, WeatherData } from '../types'

// ==================== Types ====================

interface WeatherSettings {
  /** Unit system preference (metric or imperial) */
  unitSystem: UnitSystem

  /** Toggle unit system */
  toggleUnitSystem: () => void

  /** Set unit system directly */
  setUnitSystem: (unit: UnitSystem) => void
}

interface CoordinateParams {
  lat: number
  lng: number
}

// ==================== Context ====================

const WeatherSettingsContext = createContext<WeatherSettings | null>(null)

const STORAGE_KEY = 'weather-unit-preference'

/**
 * Weather Settings Provider
 *
 * Provides unit preference (metric/imperial) stored in localStorage.
 * Wrap your layout or app with this provider to enable weather components.
 */
export function WeatherSettingsProvider({
  children,
  defaultUnit = 'metric',
}: {
  children: React.ReactNode
  defaultUnit?: UnitSystem
}) {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(defaultUnit)

  // Load preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'metric' || stored === 'imperial') {
        setUnitSystemState(stored)
      }
    }
  }, [])

  const setUnitSystem = useCallback((unit: UnitSystem) => {
    setUnitSystemState(unit)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, unit)
    }
  }, [])

  const toggleUnitSystem = useCallback(() => {
    setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')
  }, [unitSystem, setUnitSystem])

  const value: WeatherSettings = {
    unitSystem,
    toggleUnitSystem,
    setUnitSystem,
  }

  return (
    <WeatherSettingsContext.Provider value={value}>
      {children}
    </WeatherSettingsContext.Provider>
  )
}

/**
 * Use weather settings context
 */
export function useWeatherSettings(): WeatherSettings {
  const context = useContext(WeatherSettingsContext)
  if (!context) {
    // Return default values if not wrapped in provider
    return {
      unitSystem: 'metric',
      toggleUnitSystem: () => {},
      setUnitSystem: () => {},
    }
  }
  return context
}

// ==================== Fetcher ====================

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch weather data')
  }
  return res.json()
}

// ==================== Hooks ====================

/**
 * Hook for fetching current weather
 *
 * @param coords Coordinates { lat, lng } or null to skip
 * @param locale Language code (default: 'en')
 */
export function useCurrentWeather(
  coords: CoordinateParams | null,
  locale = 'en',
) {
  const url = coords
    ? `/api/weather/current?lat=${coords.lat}&lng=${coords.lng}&locale=${locale}`
    : null

  const { data, error, isLoading, mutate } = useSWR<CurrentWeather>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes client-side dedup
  })

  return {
    weather: data,
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook for fetching weather with forecast
 *
 * @param coords Coordinates { lat, lng } or null to skip
 * @param days Number of forecast days (1-3)
 * @param locale Language code (default: 'en')
 */
export function useForecastWeather(
  coords: CoordinateParams | null,
  days = 3,
  locale = 'en',
) {
  const clampedDays = Math.min(Math.max(days, 1), 3)
  const url = coords
    ? `/api/weather/forecast?lat=${coords.lat}&lng=${coords.lng}&days=${clampedDays}&locale=${locale}`
    : null

  const { data, error, isLoading, mutate } = useSWR<WeatherData>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes client-side dedup
  })

  return {
    weather: data,
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook for fetching weather for an experience
 *
 * @param experienceId Experience ID or null to skip
 * @param days Number of forecast days (1-3)
 * @param locale Language code (default: 'en')
 */
export function useExperienceWeather(
  experienceId: string | null,
  days = 3,
  locale = 'en',
) {
  const clampedDays = Math.min(Math.max(days, 1), 3)
  const url = experienceId
    ? `/api/weather/experience/${experienceId}?days=${clampedDays}&locale=${locale}`
    : null

  const { data, error, isLoading, mutate } = useSWR<WeatherData>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  })

  return {
    weather: data,
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook for fetching weather for a city
 *
 * @param cityId City ID or null to skip
 * @param days Number of forecast days (1-3)
 * @param locale Language code (default: 'en')
 */
export function useCityWeather(
  cityId: string | null,
  days = 3,
  locale = 'en',
) {
  const clampedDays = Math.min(Math.max(days, 1), 3)
  const url = cityId
    ? `/api/weather/city/${cityId}?days=${clampedDays}&locale=${locale}`
    : null

  const { data, error, isLoading, mutate } = useSWR<WeatherData>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
  })

  return {
    weather: data,
    error,
    isLoading,
    refresh: mutate,
  }
}

// ==================== Unit Conversion Utilities ====================

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
    return Math.round(kmh * 0.621371) // km/h to mph
  }
  return Math.round(kmh)
}

/**
 * Get wind speed unit string
 */
export function getWindSpeedUnit(unit: UnitSystem): string {
  return unit === 'imperial' ? 'mph' : 'km/h'
}

/**
 * Convert visibility based on unit system
 */
export function convertVisibility(km: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round(km * 0.621371 * 10) / 10 // km to miles
  }
  return Math.round(km * 10) / 10
}

/**
 * Get visibility unit string
 */
export function getVisibilityUnit(unit: UnitSystem): string {
  return unit === 'imperial' ? 'mi' : 'km'
}

/**
 * Convert precipitation based on unit system
 */
export function convertPrecipitation(mm: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round(mm * 0.0393701 * 100) / 100 // mm to inches
  }
  return Math.round(mm * 10) / 10
}

/**
 * Get precipitation unit string
 */
export function getPrecipitationUnit(unit: UnitSystem): string {
  return unit === 'imperial' ? 'in' : 'mm'
}
