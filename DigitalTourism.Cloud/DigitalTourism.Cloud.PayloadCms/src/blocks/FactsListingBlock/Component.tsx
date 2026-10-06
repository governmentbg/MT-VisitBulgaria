import React from 'react'
import { getLocale } from 'next-intl/server'

import type { FactsListingBlock as FactsListingBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { WeatherElement } from '@/components/ui'
import {
  CloudRegular,
  WeatherSunnyRegular,
  WeatherRainRegular,
} from '@/components/ui/icons'
import { getWeatherForCity } from '@/plugins/weather/server'
import type { WeatherCondition } from '@/plugins/weather/types'
import { FactsListing, type FactItemData } from '@/components/FactsListing'

const conditionIconMap: Partial<Record<WeatherCondition, React.ReactNode>> = {
  sunny: <WeatherSunnyRegular />,
  clear: <WeatherSunnyRegular />,
  partly_cloudy: <CloudRegular />,
  cloudy: <CloudRegular />,
  overcast: <CloudRegular />,
  rain: <WeatherRainRegular />,
  light_rain: <WeatherRainRegular />,
  heavy_rain: <WeatherRainRegular />,
  drizzle: <WeatherRainRegular />,
  snow: <CloudRegular />,
  light_snow: <CloudRegular />,
  heavy_snow: <CloudRegular />,
}

type Props = FactsListingBlockProps & { pageId?: number }

export const FactsListingBlockComponent: React.FC<Props> = async (props) => {
  const {
    heading,
    description,
    image,
    imagePosition = 'left',
    showWeather,
    weatherCity,
    items,
  } = props

  if (!items?.length) return null

  const locale = await getLocale()

  // Fetch weather data if enabled and city is set
  let weatherSlot: React.ReactNode = null
  if (showWeather && weatherCity) {
    const cityId = typeof weatherCity === 'object' ? String(weatherCity.id) : String(weatherCity)
    const weatherData = await getWeatherForCity(cityId, 1, locale)

    if (weatherData) {
      const conditionIcon =
        conditionIconMap[weatherData.current.condition] ?? <CloudRegular />

      weatherSlot = (
        <WeatherElement
          city={weatherData.location.name}
          temperature={Math.round(weatherData.current.temperature)}
          humidity={weatherData.current.humidity}
          conditionIcon={conditionIcon}
        />
      )
    }
  }

  // Map CMS items to FactItemData
  const factItems: FactItemData[] = items.map((item) => {
    // Resolve link href
    let linkHref: string | undefined
    let linkLabel: string | undefined
    if (item.link) {
      linkLabel = item.link.label || undefined
      if (item.link.type === 'custom' && item.link.url) {
        linkHref = item.link.url
      } else if (item.link.type === 'reference' && item.link.reference) {
        const ref = item.link.reference.value
        if (typeof ref === 'object' && ref !== null) {
          const page = ref as { breadcrumbs?: { url?: string | null }[]; slug?: string }
          const breadcrumbs = page.breadcrumbs
          if (breadcrumbs?.length) {
            linkHref = breadcrumbs[breadcrumbs.length - 1]?.url || undefined
          } else if (page.slug) {
            linkHref = `/${page.slug}`
          }
        }
      }
    }

    // Resolve icon media
    let iconSlot: React.ReactNode = undefined
    if (item.icon) {
      iconSlot = (
        <Media
          resource={item.icon}
          usePayloadSizes
          preferredSize="thumbnail"
          className="h-6 w-6 object-contain"
          imgClassName="h-6 w-6 object-contain"
        />
      )
    }

    return {
      icon: iconSlot,
      title: item.title,
      description: item.description || undefined,
      linkLabel,
      linkHref,
    }
  })

  return (
    <FactsListing
      heading={heading || undefined}
      description={description || undefined}
      imagePosition={imagePosition || 'left'}
      weatherSlot={weatherSlot}
      items={factItems}
      imageSlot={
        <Media
          resource={image}
          usePayloadSizes
          preferredSize="large"
          className="h-full w-full object-cover"
          imgClassName="h-full w-full object-cover"
        />
      }
    />
  )
}
