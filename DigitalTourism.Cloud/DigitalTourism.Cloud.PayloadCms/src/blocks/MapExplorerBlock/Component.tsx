import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { StaticMapBlockClient } from './Component.client'
import { getPayloadClient } from '@/payload/payloadClient'
import { searchNearby } from '@/plugins/typesense'
import { searchMapExperiences } from '@/lib/search/searchMapExperiences'
import type { MapExplorerPOI } from '@/components/MapExplorer/types'
import type { ExperienceSlug } from '@/collections/Experiences/constants'
import type { StaticMapClientProps } from '@/components/MapExplorer/StaticMap/StaticMapClient'

/** Extract a numeric/string ID from a value that may be a populated document or a raw ID. */
function extractId(value: unknown): string | number {
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as any).id
  }
  return value as string | number
}

interface MapExplorerBlockProps {
  mode?: 'nearby' | 'region' | null
  // Nearby mode
  nearbyExperience?: { relationTo: string; value: string | number } | null
  nearbyStrategy?: 'radius' | 'count' | null
  nearbyRadius?: number | null
  nearbyCount?: string | null
  // Region mode
  regionScope?: 'region' | 'municipality' | 'city' | null
  regionRelation?: string | number | null
  municipalityRelation?: string | number | null
  cityRelation?: string | number | null
  // Shared
  mapHeight?: 'sm' | 'md' | 'lg' | null
  blockType?: string
}

type NearbyHitDocument = {
  id: string
  title: string
  slug: string
  type: string
  'categories.title'?: string[]
  'city.name': string
  'heroImage.url'?: string
  'heroImage.alt'?: string
  location?: [number, number]
}

function hitsToPois(
  hits: Array<{ document: NearbyHitDocument }>,
): MapExplorerPOI[] {
  return hits
    .filter((hit) => hit.document.location)
    .map((hit) => ({
      id: hit.document.id,
      title: hit.document.title,
      slug: hit.document.slug,
      type: hit.document.type,
      categories: hit.document['categories.title'],
      location: {
        lat: hit.document.location![0],
        lng: hit.document.location![1],
      },
      city: hit.document['city.name'],
      heroImageUrl: hit.document['heroImage.url'],
      heroImageAlt: hit.document['heroImage.alt'],
    }))
}

function computeBounds(pois: MapExplorerPOI[]) {
  if (pois.length === 0) return undefined

  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity

  for (const poi of pois) {
    minLat = Math.min(minLat, poi.location.lat)
    maxLat = Math.max(maxLat, poi.location.lat)
    minLng = Math.min(minLng, poi.location.lng)
    maxLng = Math.max(maxLng, poi.location.lng)
  }

  return {
    center: [(minLat + maxLat) / 2, (minLng + maxLng) / 2] as [number, number],
    fitBounds: {
      northEast: { lat: maxLat, lng: maxLng },
      southWest: { lat: minLat, lng: minLng },
    },
  }
}

const NEARBY_INCLUDE_FIELDS = [
  'id', 'title', 'slug', 'type', 'categories.title',
  'city.name', 'heroImage.url', 'heroImage.alt', 'location',
]

export async function MapExplorerBlockComponent(props: MapExplorerBlockProps) {
  const locale = await getLocale()
  const allMessages = await getMessages()
  const mode = props.mode ?? 'nearby'
  const height = props.mapHeight ?? 'md'

  // ── Nearby mode ─────────────────────────────────────────────────────
  if (mode === 'nearby') {
    if (!props.nearbyExperience?.relationTo || !props.nearbyExperience?.value) {
      return null
    }

    const payload = await getPayloadClient()

    // Payload may populate the relationship (value = full doc) or leave it as an ID.
    // Either way we need the full document with location.coordinates, so always fetch by ID.
    const rawValue = props.nearbyExperience.value
    const experienceId = typeof rawValue === 'object' && rawValue !== null
      ? (rawValue as any).id
      : rawValue
    const doc = await payload.findByID({
      collection: props.nearbyExperience.relationTo as ExperienceSlug,
      id: experienceId,
      locale: locale as 'en' | 'bg',
    })

    const coords = (doc as any)?.location?.coordinates
    if (!coords?.latitude || !coords?.longitude) return null

    const lat = coords.latitude as number
    const lng = coords.longitude as number

    const strategy = props.nearbyStrategy ?? 'radius'
    const radiusKm = strategy === 'radius' ? (props.nearbyRadius ?? 10) : 200
    const perPage = strategy === 'count' ? parseInt(props.nearbyCount ?? '10', 10) : 50

    const result = await searchNearby<NearbyHitDocument>('experiences', locale, {
      q: '*',
      queryBy: ['title'],
      geoField: 'location',
      point: { lat, lng },
      radiusKm,
      sortByDistance: true,
      perPage,
      includeFields: NEARBY_INCLUDE_FIELDS,
    })

    const pois = hitsToPois(result.hits)
    const centerSlug = (doc as any)?.slug as string | undefined

    return (
      <NextIntlClientProvider messages={{ mapExplorer: allMessages.mapExplorer }}>
        <StaticMapBlockClient
          pois={pois}
          center={[lat, lng]}
          zoom={13}
          height={height}
          highlightSlug={centerSlug}
        />
      </NextIntlClientProvider>
    )
  }

  // ── Region mode ─────────────────────────────────────────────────────
  if (mode === 'region') {
    const scope = props.regionScope ?? 'city'
    const payload = await getPayloadClient()

    let filterName: string | undefined
    let filterKey: 'region' | 'municipality' | 'city'

    if (scope === 'city' && props.cityRelation) {
      const id = extractId(props.cityRelation)
      const city = await payload.findByID({ collection: 'cities', id, locale: locale as 'en' | 'bg' })
      filterName = (city as any)?.name
      filterKey = 'city'
    } else if (scope === 'municipality' && props.municipalityRelation) {
      const id = extractId(props.municipalityRelation)
      const municipality = await payload.findByID({ collection: 'municipalities', id, locale: locale as 'en' | 'bg' })
      filterName = (municipality as any)?.name
      filterKey = 'municipality'
    } else if (scope === 'region' && props.regionRelation) {
      const id = extractId(props.regionRelation)
      const region = await payload.findByID({ collection: 'regions', id, locale: locale as 'en' | 'bg' })
      filterName = (region as any)?.name
      filterKey = 'region'
    } else {
      return null
    }

    if (!filterName) return null

    const result = await searchMapExperiences({
      locale,
      filters: { [filterKey!]: [filterName] },
    })

    const pois: MapExplorerPOI[] = result.hits
      .filter((hit) => hit.location?.coordinates)
      .map((hit) => ({
        id: hit.id,
        title: hit.title,
        slug: hit.slug,
        type: hit.type,
        categories: hit.categories,
        location: {
          lat: hit.location!.coordinates!.latitude,
          lng: hit.location!.coordinates!.longitude,
        },
        city: hit.location?.city,
        heroImageUrl: hit.heroImage?.url,
        heroImageAlt: hit.heroImage?.alt,
      }))

    const bounds = computeBounds(pois)

    const staticProps: StaticMapClientProps = {
      pois,
      center: bounds?.center ?? [42.7, 25.5],
      zoom: 10,
      height,
      ...(bounds?.fitBounds && { fitBounds: bounds.fitBounds }),
    }

    return (
      <NextIntlClientProvider messages={{ mapExplorer: allMessages.mapExplorer }}>
        <StaticMapBlockClient {...staticProps} />
      </NextIntlClientProvider>
    )
  }

  return null
}
