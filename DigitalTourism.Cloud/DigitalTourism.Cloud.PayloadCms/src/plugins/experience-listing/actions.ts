'use server'

import { createLogger } from '@/plugins/logging'
import { getTypesenseService, isServiceInitialized } from '@/plugins/typesense'
import type { BlockSearchParams, BlockSearchResponse, BlockSearchResult } from './types'

const logger = createLogger('experience-listing:actions')

// Typesense filter helpers — backtick-quote values to handle spaces/special chars
const quote = (v: string) => '`' + v + '`'
const arrayFilter = (field: string, values: string[]) =>
  `${field}:=[${values.map(quote).join(',')}]`

export async function searchExperiencesForBlock(
  params: BlockSearchParams,
): Promise<BlockSearchResponse> {
  const {
    query,
    locale,
    page = 1,
    perPage = 12,
    filters = {},
    sortBy = '_text_match:desc',
  } = params

  if (!isServiceInitialized()) {
    logger.warn('Typesense service not initialized')
    return { hits: [], found: 0, page: 1, totalPages: 0, searchTimeMs: 0 }
  }

  try {
    const service = getTypesenseService()

    const filterExpressions: string[] = []

    if (filters.type && filters.type.length > 0) {
      filterExpressions.push(arrayFilter('type', filters.type))
    }
    if (filters.categories && filters.categories.length > 0) {
      filterExpressions.push(arrayFilter('categories.title', filters.categories))
    }
    if (filters.tags && filters.tags.length > 0) {
      filterExpressions.push(arrayFilter('tags.title', filters.tags))
    }
    if (filters.region && filters.region.length > 0) {
      filterExpressions.push(arrayFilter('region.name', filters.region))
    }
    if (filters.municipality && filters.municipality.length > 0) {
      filterExpressions.push(arrayFilter('municipality.name', filters.municipality))
    }
    if (filters.city && filters.city.length > 0) {
      filterExpressions.push(arrayFilter('city.name', filters.city))
    }

    const result = await service.search<{
      id: string
      title: string
      slug: string
      type: string
      description: string
      'categories.title'?: string[]
      'tags.title'?: string[]
      'city.name': string
      'municipality.name'?: string
      'region.name'?: string
      'heroImage.url'?: string
      'heroImage.alt'?: string
      publishedAt?: number
      'period.startDate'?: number
    }>('experiences', locale, {
      q: query || '*',
      queryBy: ['title', 'description', 'city.name', 'municipality.name', 'region.name'],
      filterBy: filterExpressions.length > 0 ? filterExpressions.join(' && ') : undefined,
      sortBy,
      page,
      perPage,
      facetBy: [
        'type',
        'categories.title',
        'tags.title',
        'city.name',
        'municipality.name',
        'region.name',
      ],
      highlightFields: ['title'],
    })

    const hits: BlockSearchResult[] = result.hits.map((hit) => ({
      id: hit.document.id,
      title: hit.document.title,
      slug: hit.document.slug,
      type: hit.document.type,
      description: hit.document.description,
      categories: hit.document['categories.title'],
      tags: hit.document['tags.title'],
      location: {
        city: hit.document['city.name'],
        municipality: hit.document['municipality.name'],
        region: hit.document['region.name'],
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
    }))

    const totalPages = Math.ceil(result.found / perPage)

    return {
      hits,
      found: result.found,
      page: result.page,
      totalPages,
      searchTimeMs: result.searchTimeMs,
      facets: result.facetCounts as BlockSearchResponse['facets'],
    }
  } catch (error) {
    logger.error('Block search error', {
      error: error instanceof Error ? error.message : String(error),
    })
    return { hits: [], found: 0, page: 1, totalPages: 0, searchTimeMs: 0 }
  }
}
