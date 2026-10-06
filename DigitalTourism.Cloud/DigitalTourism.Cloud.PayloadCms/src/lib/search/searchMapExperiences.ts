'use server'

import { unstable_cache } from 'next/cache'
import { createLogger } from '@/plugins/logging'
import { getTypesenseService, isServiceInitialized } from '@/plugins/typesense'
import { getMapSettings, getFacetConfig, type MapSettings } from '@/utilities/getSettings'
import type { ExperienceSearchFilters, ExperienceSearchResult, FacetValue } from './types'
import { buildFilterExpressions, buildFacetFilterConfig } from './filterBuilder'

const logger = createLogger('search:map')

/** Aggressively cached map settings — revalidates only on settings save or every 24h. */
const getCachedMapSettings = unstable_cache(
  async (): Promise<MapSettings> => getMapSettings(),
  ['map-settings'],
  { tags: ['global_settings'], revalidate: 86_400 },
)

export interface MapSearchParams {
  query?: string
  locale: string
  filters?: ExperienceSearchFilters
  groupByCity?: boolean
}

export interface CityGroup {
  city: string
  count: number
  location: { lat: number; lng: number }
  previewImageUrl?: string
}

export interface MapSearchResponse {
  hits: ExperienceSearchResult[]
  cityGroups?: CityGroup[]
  found: number
  facets?: Record<string, FacetValue[]>
}

const EMPTY_RESPONSE: MapSearchResponse = { hits: [], found: 0 }

/** All facet fields we request from Typesense for the filter drawer. */
const MAP_FACET_FIELDS = [
  'type',
  'categories.title',
  'tags.title',
  'region.name',
  'municipality.name',
  'city.name',
  'starRating',
  'amenities',
  'cuisineType',
  'dietaryOptions',
  'difficultyLevel',
  'seasonality',
  'organizer',
]

export async function searchMapExperiences(
  params: MapSearchParams,
): Promise<MapSearchResponse> {
  const { query, locale, filters = {}, groupByCity = false } = params

  if (!isServiceInitialized()) {
    logger.warn('Typesense service not initialized — returning empty')
    return EMPTY_RESPONSE
  }

  try {
    const service = getTypesenseService()
    const mapSettings = await getCachedMapSettings()
    const facetConfig = await getFacetConfig()
    const filterExpressions = buildFilterExpressions(filters, buildFacetFilterConfig(facetConfig))
    const filterBy = filterExpressions.length > 0 ? filterExpressions.join(' && ') : undefined

    if (groupByCity) {
      // Two parallel queries:
      // 1) city.id facet with high limit (100) for experience counts per city
      // 2) filter-drawer facets with default limit (10)
      const sharedParams = {
        q: query || '*',
        queryBy: ['title', 'city.name'] as string[],
        filterBy,
      }

      const [cityResult, facetResult] = await Promise.all([
        service.search<{ 'city.id': string }>(
          'experiences', locale, {
            ...sharedParams,
            perPage: 0,
            facetBy: ['city.id'],
            maxFacetValues: mapSettings.maxCityMarkers,
            includeFields: ['id'],
          },
        ),
        service.search<Record<string, never>>(
          'experiences', locale, {
            ...sharedParams,
            perPage: 0,
            facetBy: MAP_FACET_FIELDS.filter((f) => f !== 'city.name'),
            includeFields: ['id'],
          },
        ),
      ])

      const cityIdFacets = cityResult.facetCounts?.['city.id'] ?? []
      // Merge facets: city.id from first query, rest from second
      const mergedFacets: Record<string, FacetValue[]> = {
        ...facetResult.facetCounts,
        ...cityResult.facetCounts,
      }

      if (cityIdFacets.length === 0) {
        return { hits: [], cityGroups: [], found: cityResult.found, facets: mergedFacets }
      }

      // Look up cities by ID — short numeric IDs avoid Typesense's 4000-char
      // GET URL limit that was exceeded by many URL-encoded Cyrillic city names.
      const cityIds = cityIdFacets.map((f) => f.value)
      const citiesResult = await service.search<{
        id: string
        name: string
        coordinates?: [number, number]
        'heroImage.url'?: string
      }>('cities', locale, {
        q: '*',
        queryBy: ['name'],
        filterBy: `id:=[${cityIds.join(',')}]`,
        perPage: cityIds.length,
        includeFields: ['id', 'name', 'coordinates', 'heroImage.url'],
      })

      const cityDataMap = new Map<string, { name: string; coordinates: [number, number]; imageUrl?: string }>()
      for (const hit of citiesResult.hits) {
        if (hit.document.coordinates) {
          cityDataMap.set(hit.document.id, {
            name: hit.document.name,
            coordinates: hit.document.coordinates,
            imageUrl: hit.document['heroImage.url'],
          })
        }
      }

      const cityGroups: CityGroup[] = cityIdFacets
        .map((facet) => {
          const data = cityDataMap.get(facet.value)
          if (!data) return null
          return {
            city: data.name,
            count: facet.count,
            location: { lat: data.coordinates[0], lng: data.coordinates[1] },
            previewImageUrl: data.imageUrl,
          } as CityGroup
        })
        .filter((g): g is CityGroup => g !== null)

      return {
        hits: [],
        cityGroups,
        found: cityResult.found,
        facets: mergedFacets,
      }
    }

    // Individual marker level: return up to N results with minimal fields + facets.
    // Typesense caps perPage at 250 so we paginate if the configured limit is higher.
    type HitDoc = {
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

    const TYPESENSE_MAX_PER_PAGE = 250
    const desired = mapSettings.maxExperienceMarkers
    const sharedSearchParams = {
      q: query || '*',
      queryBy: ['title', 'city.name'] as string[],
      filterBy,
      facetBy: MAP_FACET_FIELDS,
      includeFields: [
        'id',
        'title',
        'slug',
        'type',
        'categories.title',
        'city.name',
        'heroImage.url',
        'heroImage.alt',
        'location',
      ],
    }

    // First page — always needed (also gives us facets + total found)
    const firstPageSize = Math.min(desired, TYPESENSE_MAX_PER_PAGE)
    const firstResult = await service.search<HitDoc>('experiences', locale, {
      ...sharedSearchParams,
      perPage: firstPageSize,
      page: 1,
    })

    let allRawHits = firstResult.hits
    const remaining = desired - firstPageSize

    // Fetch additional pages in parallel if we need more than 250
    if (remaining > 0 && firstResult.found > firstPageSize) {
      const pages: number[] = []
      let fetched = firstPageSize
      let pageNum = 2
      while (fetched < desired && fetched < firstResult.found) {
        pages.push(pageNum++)
        fetched += TYPESENSE_MAX_PER_PAGE
      }

      const extraResults = await Promise.all(
        pages.map((p) =>
          service.search<HitDoc>('experiences', locale, {
            ...sharedSearchParams,
            perPage: Math.min(TYPESENSE_MAX_PER_PAGE, desired - (p - 1) * TYPESENSE_MAX_PER_PAGE),
            page: p,
            // Skip facets on subsequent pages — we already have them from page 1
            facetBy: [],
          }),
        ),
      )

      for (const r of extraResults) {
        allRawHits = allRawHits.concat(r.hits)
      }
    }

    // Trim to the exact desired count (last page may overshoot)
    if (allRawHits.length > desired) {
      allRawHits = allRawHits.slice(0, desired)
    }

    const hits: ExperienceSearchResult[] = allRawHits
      .filter((hit) => hit.document.location)
      .map((hit) => ({
        id: hit.document.id,
        title: hit.document.title,
        slug: hit.document.slug,
        type: hit.document.type,
        categories: hit.document['categories.title'],
        location: {
          city: hit.document['city.name'],
          coordinates: hit.document.location
            ? { latitude: hit.document.location[0], longitude: hit.document.location[1] }
            : undefined,
        },
        heroImage: hit.document['heroImage.url']
          ? { url: hit.document['heroImage.url'], alt: hit.document['heroImage.alt'] }
          : undefined,
      }))

    return {
      hits,
      found: firstResult.found,
      facets: firstResult.facetCounts,
    }
  } catch (error) {
    logger.error('Map search error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return EMPTY_RESPONSE
  }
}
