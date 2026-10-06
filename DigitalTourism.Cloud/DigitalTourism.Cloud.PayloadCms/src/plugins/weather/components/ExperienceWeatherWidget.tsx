import React from 'react'
import { cn } from '@/components/ui'
import { getTranslations } from 'next-intl/server'
import type { Coordinates } from '../types'
import { getWeatherByCoordinates } from '../server'
import { ExperienceWeatherWidgetClient } from './ExperienceWeatherWidgetClient'

interface ExperienceWeatherWidgetProps {
  coordinates: Coordinates
  locationName: string
  className?: string
  locale?: string
}

/**
 * Experience Weather Widget (Server Component)
 * Fetches weather data on the server and passes to client for unit-aware rendering.
 */
export async function ExperienceWeatherWidget({
  coordinates,
  locationName,
  className,
  locale = 'en',
}: ExperienceWeatherWidgetProps) {
  const t = await getTranslations('weather')
  const weather = await getWeatherByCoordinates(coordinates, 3, locale)

  if (!weather) {
    return null
  }

  // Pass translations as props to avoid async in client component
  const translations = {
    feels: t('feels'),
    humidity: t('humidity'),
    wind: t('wind'),
    today: t('today'),
  }

  return (
    <div className={cn('weather-widget', className)}>
      <ExperienceWeatherWidgetClient
        weather={weather}
        locationName={locationName}
        locale={locale}
        translations={translations}
      />
    </div>
  )
}
