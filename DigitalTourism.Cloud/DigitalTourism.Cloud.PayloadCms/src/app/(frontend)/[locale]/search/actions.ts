'use server'

/**
 * Search page-specific actions.
 * The main searchExperiences is now in @/lib/search.
 * This file keeps page-specific utilities like geo search and nomenclature mapping.
 */

import { createLogger } from '@/plugins/logging'
import { getTypesenseService, isServiceInitialized } from '@/plugins/typesense'
import type { ExperienceSearchResult, ExperienceSearchResponse } from '@/lib/search'

const logger = createLogger('search:actions')

interface GeoSearchParams {
  locale: string
  lat: number
  lng: number
  radiusKm?: number
  page?: number
  perPage?: number
  filterType?: string
  excludeId?: string
}

/**
 * Server action to search experiences near a location
 */
export async function searchNearbyExperiences(params: GeoSearchParams): Promise<ExperienceSearchResponse> {
  const { locale, lat, lng, radiusKm = 50, page = 1, perPage = 12, filterType, excludeId } = params

  if (!isServiceInitialized()) {
    logger.warn('Typesense service not initialized')
    return { hits: [], found: 0, page: 1, totalPages: 0, searchTimeMs: 0 }
  }

  try {
    const service = getTypesenseService()

    // Build filter: type filter + exclude current experience
    const filters: string[] = []
    if (filterType) filters.push(`type:=${filterType}`)
    if (excludeId) filters.push(`id:!=[${excludeId}]`)
    const filterBy = filters.length > 0 ? filters.join(' && ') : undefined

    const result = await service.searchNearby<{
      id: string
      title: string
      slug: string
      type: string
      description: string
      'city.name': string
      'municipality.name'?: string
      'region.name'?: string
      'heroImage.url'?: string
      'heroImage.alt'?: string
      'categories.title'?: string[]
      location?: [number, number]
    }>('experiences', locale, {
      q: '*',
      queryBy: ['title'],
      geoField: 'location',
      point: { lat, lng },
      radiusKm,
      sortByDistance: true,
      filterBy,
      page,
      perPage,
      facetBy: ['type', 'city.name', 'municipality.name', 'region.name'],
    })

    const hits: ExperienceSearchResult[] = result.hits.map((hit) => ({
      id: hit.document.id,
      title: hit.document.title,
      slug: hit.document.slug,
      type: hit.document.type as string,
      description: hit.document.description,
      categories: hit.document['categories.title'],
      location: {
        city: hit.document['city.name'],
        municipality: hit.document['municipality.name'],
        region: hit.document['region.name'],
        coordinates: hit.document.location
          ? { latitude: hit.document.location[0], longitude: hit.document.location[1] }
          : undefined,
      },
      heroImage: hit.document['heroImage.url']
        ? { url: hit.document['heroImage.url'], alt: hit.document['heroImage.alt'] }
        : undefined,
    }))

    const totalPages = Math.ceil(result.found / perPage)

    return {
      hits,
      found: result.found,
      page: result.page,
      totalPages,
      searchTimeMs: result.searchTimeMs,
      facets: result.facetCounts as ExperienceSearchResponse['facets'],
    }
  } catch (error) {
    logger.error('Geo search error', { error: error instanceof Error ? error.message : String(error) })
    return { hits: [], found: 0, page: 1, totalPages: 0, searchTimeMs: 0 }
  }
}

// NomenclatureDisplayData and getNomenclatureDisplayMap moved to @/lib/search/nomenclature
