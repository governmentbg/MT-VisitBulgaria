/**
 * Search API - typed search with geo-search support (T061-T065)
 */

import type { SearchParams, GeoSearchParams } from './types'
import { getClient } from './client'
import { getCollectionName } from './locale'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:search')

/**
 * Convert SearchParams to Typesense search parameters
 */
function toTypesenseParams(params: SearchParams): Record<string, unknown> {
  const typesenseParams: Record<string, unknown> = {
    q: params.q,
    query_by: params.queryBy.join(','),
  }

  if (params.filterBy) {
    typesenseParams.filter_by = params.filterBy
  }

  if (params.sortBy) {
    typesenseParams.sort_by = params.sortBy
  }

  if (params.facetBy && params.facetBy.length > 0) {
    typesenseParams.facet_by = params.facetBy.join(',')
  }

  if (params.page !== undefined) {
    typesenseParams.page = params.page
  }

  if (params.perPage !== undefined) {
    typesenseParams.per_page = params.perPage
  }

  if (params.numTypos !== undefined) {
    typesenseParams.num_typos = params.numTypos
  }

  if (params.highlightFields && params.highlightFields.length > 0) {
    typesenseParams.highlight_fields = params.highlightFields.join(',')
  }

  if (params.groupBy) {
    typesenseParams.group_by = params.groupBy
  }

  if (params.groupLimit !== undefined) {
    typesenseParams.group_limit = params.groupLimit
  }

  if (params.includeFields && params.includeFields.length > 0) {
    typesenseParams.include_fields = params.includeFields.join(',')
  }

  if (params.excludeFields && params.excludeFields.length > 0) {
    typesenseParams.exclude_fields = params.excludeFields.join(',')
  }

  if (params.maxFacetValues !== undefined) {
    typesenseParams.max_facet_values = params.maxFacetValues
  }

  return typesenseParams
}

/**
 * Internal type for simplified search result used in tests
 */
interface SimpleSearchResult<T> {
  document: T
  score: number
  highlights?: Record<string, string[]>
  geoDistanceKm?: number
}

/**
 * Internal type for simplified search response used in tests
 */
interface SimpleSearchResponse<T> {
  hits: SimpleSearchResult<T>[]
  found: number
  page: number
  searchTimeMs: number
  facetCounts?: Record<string, { value: string; count: number }[]>
}

/**
 * Map Typesense response to SearchResponse (T064)
 */
function mapSearchResponse<T>(response: any, geoField?: string): SimpleSearchResponse<T> {
  // When group_by is used, Typesense returns grouped_hits instead of hits.
  // Flatten grouped results so downstream code sees a uniform hit array.
  const rawHits: any[] = response.grouped_hits
    ? response.grouped_hits.flatMap((g: any) => g.hits || [])
    : (response.hits || [])

  // Map hits (T064)
  const hits: SimpleSearchResult<T>[] = rawHits.map((hit: any) => {
    const result: SimpleSearchResult<T> = {
      document: hit.document as T,
      score: hit.text_match || 0,
    }

    // Map highlights
    if (hit.highlights && hit.highlights.length > 0) {
      result.highlights = {}
      for (const highlight of hit.highlights) {
        if (highlight.snippet) {
          result.highlights[highlight.field] = [highlight.snippet]
        } else if (highlight.snippets) {
          result.highlights[highlight.field] = highlight.snippets
        }
      }
    }

    // Map geo distance
    if (geoField && hit.geo_distance_meters?.[geoField]) {
      result.geoDistanceKm = hit.geo_distance_meters[geoField] / 1000
    }

    return result
  })

  // Map facet counts (T065)
  let facetCounts: Record<string, { value: string; count: number }[]> | undefined
  if (response.facet_counts && response.facet_counts.length > 0) {
    facetCounts = {}
    for (const facet of response.facet_counts) {
      facetCounts[facet.field_name] = facet.counts.map((c: any) => ({
        value: c.value,
        count: c.count,
      }))
    }
  }

  return {
    hits,
    found: response.found || 0,
    page: response.page || 1,
    searchTimeMs: response.search_time_ms || 0,
    facetCounts,
  }
}

/**
 * Perform a typed search (T061)
 *
 * @example
 * ```typescript
 * const results = await search<Experience>('experiences', 'en', {
 *   q: 'hotel',
 *   queryBy: ['title', 'description'],
 *   filterBy: 'type:=hotel',
 *   facetBy: ['type', 'starRating'],
 * })
 *
 * console.log(results.hits[0].document.title)
 * console.log(results.facetCounts?.type)
 * ```
 */
export async function search<T = Record<string, unknown>>(
  collection: string,
  locale: string,
  params: SearchParams,
): Promise<SimpleSearchResponse<T>> {
  const client = getClient()
  const collectionName = getCollectionName(collection, locale)

  logger.debug(`Searching ${collectionName}`, { q: params.q })

  const typesenseParams = toTypesenseParams(params)
  const response = await client.collections(collectionName).documents().search(typesenseParams)

  return mapSearchResponse<T>(response)
}

/**
 * Perform a geo-distance search (T062)
 *
 * @example
 * ```typescript
 * const nearby = await searchNearby<Experience>('experiences', 'en', {
 *   q: '*',
 *   queryBy: ['title'],
 *   geoField: 'location',
 *   point: { lat: 42.6977, lng: 23.3219 },
 *   radiusKm: 10,
 *   sortByDistance: true,
 * })
 *
 * console.log(nearby.hits[0].geoDistanceKm) // Distance in km
 * ```
 */
export async function searchNearby<T = Record<string, unknown>>(
  collection: string,
  locale: string,
  params: GeoSearchParams,
): Promise<SimpleSearchResponse<T>> {
  const client = getClient()
  const collectionName = getCollectionName(collection, locale)

  const { geoField, point, radiusKm, sortByDistance, ...searchParams } = params

  // Build geo filter
  const geoFilter = `${geoField}:(${point.lat}, ${point.lng}, ${radiusKm} km)`

  // Combine with existing filter
  const filterBy = searchParams.filterBy ? `${searchParams.filterBy} && ${geoFilter}` : geoFilter

  // Build sort by distance if requested
  let sortBy = searchParams.sortBy
  if (sortByDistance) {
    const geoSort = `${geoField}(${point.lat}, ${point.lng}):asc`
    sortBy = sortBy ? `${geoSort},${sortBy}` : geoSort
  }

  logger.debug(`Geo search ${collectionName}`, {
    q: params.q,
    point,
    radiusKm,
  })

  const typesenseParams = toTypesenseParams({
    ...searchParams,
    filterBy,
    sortBy,
  })

  const response = await client.collections(collectionName).documents().search(typesenseParams)

  return mapSearchResponse<T>(response, geoField)
}

/**
 * Multi-search request configuration
 */
export interface MultiSearchRequest {
  collection: string
  locale: string
  params: SearchParams
}

/**
 * Perform multiple searches in a single request (T063)
 *
 * Useful for:
 * - Searching across multiple collections
 * - Searching same collection in different locales
 * - Implementing federated search
 *
 * @example
 * ```typescript
 * const results = await multiSearch([
 *   { collection: 'experiences', locale: 'en', params: { q: 'hotel', queryBy: ['title'] } },
 *   { collection: 'destinations', locale: 'en', params: { q: 'hotel', queryBy: ['name'] } },
 * ])
 * ```
 */
export async function multiSearch<T = Record<string, unknown>>(
  requests: MultiSearchRequest[],
): Promise<SimpleSearchResponse<T>[]> {
  const client = getClient()

  const searches = requests.map(({ collection, locale, params }) => {
    const collectionName = getCollectionName(collection, locale)
    const typesenseParams = toTypesenseParams(params)

    return {
      collection: collectionName,
      ...typesenseParams,
    }
  })

  logger.debug(`Multi-search across ${requests.length} collections`)

  const response = await client.multiSearch.perform({ searches })

  return (response.results || []).map((result: any) => mapSearchResponse<T>(result))
}

/**
 * Search all configured locales for a collection
 */
export async function searchAllLocales<T = Record<string, unknown>>(
  collection: string,
  locales: string[],
  params: SearchParams,
): Promise<Map<string, SimpleSearchResponse<T>>> {
  const requests = locales.map((locale) => ({
    collection,
    locale,
    params,
  }))

  const responses = await multiSearch<T>(requests)

  const results = new Map<string, SimpleSearchResponse<T>>()
  for (let i = 0; i < locales.length; i++) {
    results.set(locales[i], responses[i])
  }

  return results
}

/**
 * Search with automatic typo tolerance
 */
export async function fuzzySearch<T = Record<string, unknown>>(
  collection: string,
  locale: string,
  params: Omit<SearchParams, 'numTypos'>,
): Promise<SimpleSearchResponse<T>> {
  return search<T>(collection, locale, {
    ...params,
    numTypos: 2, // Maximum typo tolerance
  })
}
