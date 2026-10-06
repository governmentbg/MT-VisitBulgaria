'use server'

import { createLogger } from '@/plugins/logging'
import { getTypesenseService, isServiceInitialized } from '@/plugins/typesense'
import type { ExperienceSearchParams, ExperienceSearchResponse, ExperienceSearchResult } from './types'
import { buildFilterExpressions, buildFacetFilterConfig } from './filterBuilder'
import { getFacetConfig } from '@/utilities/getSettings'

const logger = createLogger('search:unified')

const EMPTY_RESPONSE: ExperienceSearchResponse = {
  hits: [],
  found: 0,
  page: 1,
  totalPages: 0,
  searchTimeMs: 0,
}

export async function searchExperiences(
  params: ExperienceSearchParams,
): Promise<ExperienceSearchResponse> {
  const {
    query,
    locale,
    page = 1,
    perPage = 12,
    filters = {},
    geoSort,
  } = params

  // geoSort overrides sortBy — sort by distance from point (nearest first).
  const sortBy = geoSort
    ? `location(${geoSort.lat}, ${geoSort.lng}):asc`
    : (params.sortBy ?? '_text_match:desc')

  if (!isServiceInitialized()) {
    logger.warn('Typesense service not initialized')
    return EMPTY_RESPONSE
  }

  try {
    const service = getTypesenseService()

    // Facet + geo filters — use admin-configured filter modes (AND/OR per facet)
    const facetConfig = await getFacetConfig()
    const filterExpressions = buildFilterExpressions(filters, buildFacetFilterConfig(facetConfig))

    // Non-faceted single-value filters
    if (filters.minimumAge !== undefined) {
      filterExpressions.push(`minimumAge:<=${filters.minimumAge}`)
    }
    if (filters.equipmentProvided !== undefined) {
      filterExpressions.push(`equipmentProvided:=${filters.equipmentProvided}`)
    }
    // Date range filters (Unix timestamps in milliseconds, matching Typesense storage)
    if (filters.dateFrom !== undefined) {
      filterExpressions.push(`period.startDate:>=${filters.dateFrom}`)
    }
    if (filters.dateTo !== undefined) {
      filterExpressions.push(`period.startDate:<=${filters.dateTo}`)
    }
    if (filters.dateEndAfter !== undefined) {
      filterExpressions.push(`period.endDate:>=${filters.dateEndAfter}`)
    }

    const result = await service.search<{
      id: string
      title: string
      slug: string
      type: string
      descriptionShort: string
      starRating?: number
      amenities?: string[]
      cuisineType?: string
      dietaryOptions?: string[]
      difficultyLevel?: string
      seasonality?: string[]
      minimumAge?: number
      equipmentProvided?: boolean
      organizer?: string
      'categories.title'?: string[]
      'tags.title'?: string[]
      'city.name': string
      'municipality.name'?: string
      'region.name'?: string
      'heroImage.url'?: string
      'heroImage.alt'?: string
      publishedAt?: number
      'period.startDate'?: number
      'period.endDate'?: number
      location?: [number, number]
    }>('experiences', locale, {
      q: query || '*',
      queryBy: ['title', 'description', 'city.name', 'municipality.name', 'region.name'],
      filterBy: filterExpressions.length > 0 ? filterExpressions.join(' && ') : undefined,
      sortBy,
      page,
      perPage,
      facetBy: [
        'type',
        'starRating',
        'amenities',
        'cuisineType',
        'dietaryOptions',
        'difficultyLevel',
        'seasonality',
        'minimumAge',
        'equipmentProvided',
        'organizer',
        'categories.title',
        'tags.title',
        'city.name',
        'municipality.name',
        'region.name',
      ],
      highlightFields: ['title', 'description'],
      excludeFields: ['description'],
    })

    const hits: ExperienceSearchResult[] = result.hits.map((hit) => ({
      id: hit.document.id,
      title: hit.document.title,
      slug: hit.document.slug,
      type: hit.document.type,
      description: hit.document.descriptionShort,
      starRating: hit.document.starRating,
      amenities: hit.document.amenities,
      cuisineType: hit.document.cuisineType,
      dietaryOptions: hit.document.dietaryOptions,
      difficultyLevel: hit.document.difficultyLevel,
      seasonality: hit.document.seasonality,
      minimumAge: hit.document.minimumAge,
      equipmentProvided: hit.document.equipmentProvided,
      organizer: hit.document.organizer,
      categories: hit.document['categories.title'],
      tags: hit.document['tags.title'],
      location: {
        city: hit.document['city.name'],
        municipality: hit.document['municipality.name'],
        region: hit.document['region.name'],
        coordinates: hit.document.location
          ? { latitude: hit.document.location[0], longitude: hit.document.location[1] }
          : undefined,
      },
      heroImage: hit.document['heroImage.url']
        ? {
            url: hit.document['heroImage.url'],
            alt: hit.document['heroImage.alt'],
          }
        : undefined,
      date: hit.document['period.startDate']
        ? new Date(hit.document['period.startDate']).toISOString()
        : undefined,
      endDate: hit.document['period.endDate']
        ? new Date(hit.document['period.endDate']).toISOString()
        : undefined,
    }))

    const totalPages = perPage > 0 ? Math.ceil(result.found / perPage) : 0

    return {
      hits,
      found: result.found,
      page: result.page,
      totalPages,
      searchTimeMs: result.searchTimeMs,
      facets: result.facetCounts as ExperienceSearchResponse['facets'],
    }
  } catch (error) {
    logger.error('Search error', { error: error instanceof Error ? error.message : String(error) })
    return EMPTY_RESPONSE
  }
}
