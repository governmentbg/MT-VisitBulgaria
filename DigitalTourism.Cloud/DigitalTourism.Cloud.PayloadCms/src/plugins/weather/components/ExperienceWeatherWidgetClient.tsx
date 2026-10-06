'use client'

import React, { useState, useEffect } from 'react'
import type { UnitSystem, DailyForecast, WeatherData } from '../types'
import {
  convertTemperature,
  getTemperatureUnit,
  convertWindSpeed,
  getWindSpeedUnit,
} from '../utils'
import { UnitToggle } from './UnitToggle'

interface ExperienceWeatherWidgetClientProps {
  weather: WeatherData
  locationName: string
  locale: string
  translations: {
    feels: string
    humidity: string
    wind: string
    today: string
  }
}

/**
 * Client component for weather widget that handles unit conversion.
 * Reads unit preference from cookie on client side to avoid dynamic server usage.
 */
export function ExperienceWeatherWidgetClient({
  weather,
  locationName,
  locale,
  translations,
}: ExperienceWeatherWidgetClientProps) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')

  useEffect(() => {
    // Read cookie on client side
    const cookies = document.cookie.split(';')
    const unitCookie = cookies.find((c) => c.trim().startsWith('weather-unit='))
    if (unitCookie) {
      const value = unitCookie.split('=')[1] as UnitSystem
      if (value === 'metric' || value === 'imperial') {
        setUnitSystem(value)
      }
    }
  }, [])

  const { current, forecast } = weather
  const tempUnit = getTemperatureUnit(unitSystem)
  const windUnit = getWindSpeedUnit(unitSystem)

  return (
    <div className="rounded-lg border bg-card">
      {/* Main row: current weather + stats + forecast */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
        {/* Current weather */}
        <div className="flex items-center gap-3 shrink-0">
          {current.icon && (
            <img src={current.icon} alt={current.conditionText} className="w-10 h-10" />
          )}
          <div>
            <div className="text-2xl font-semibold leading-none">
              {convertTemperature(current.temperature, unitSystem)}
              <span className="text-base font-normal text-muted-foreground">{tempUnit}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{current.conditionText}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-10 bg-border shrink-0" />

        {/* Stats */}
        <div className="flex gap-4 text-xs text-muted-foreground shrink-0 order-3 md:order-none w-full md:w-auto border-t md:border-0 pt-3 md:pt-0">
          <div>
            <span className="block text-foreground font-medium">
              {convertTemperature(current.feelsLike, unitSystem)}°
            </span>
            {translations.feels}
          </div>
          <div>
            <span className="block text-foreground font-medium">{current.humidity}%</span>
            {translations.humidity}
          </div>
          <div>
            <span className="block text-foreground font-medium">
              {convertWindSpeed(current.windSpeed, unitSystem)} {windUnit}
            </span>
            {translations.wind}
          </div>
        </div>

        {/* Divider */}
        {forecast?.daily && forecast.daily.length > 1 && (
          <div className="hidden md:block w-px h-10 bg-border shrink-0" />
        )}

        {/* 3-day forecast */}
        {forecast?.daily && forecast.daily.length > 1 && (
          <div className="flex gap-3 flex-1 justify-center md:justify-end order-4 md:order-none w-full md:w-auto border-t md:border-0 pt-3 md:pt-0">
            {forecast.daily.slice(0, 3).map((day: DailyForecast, index: number) => (
              <div key={index} className="text-center min-w-[48px]">
                <div className="text-[10px] text-muted-foreground">
                  {index === 0
                    ? translations.today
                    : new Date(day.date).toLocaleDateString(locale, { weekday: 'short' })}
                </div>
                {day.icon && <img src={day.icon} alt={day.conditionText} className="w-6 h-6 mx-auto" />}
                <div className="text-xs">
                  <span className="font-medium">{convertTemperature(day.tempMax, unitSystem)}°</span>
                  <span className="text-muted-foreground">
                    /{convertTemperature(day.tempMin, unitSystem)}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Location & toggle */}
        <div className="flex flex-col items-end gap-1 shrink-0 ml-auto order-2 md:order-none">
          <UnitToggle currentUnit={unitSystem} onToggle={setUnitSystem} />
          <span className="text-[10px] text-muted-foreground">{locationName}</span>
        </div>
      </div>
    </div>
  )
}
