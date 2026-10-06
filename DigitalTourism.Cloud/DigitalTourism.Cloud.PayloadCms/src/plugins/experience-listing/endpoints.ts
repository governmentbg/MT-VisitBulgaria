/**
 * Experience Listing Admin Preview Endpoint
 *
 * GET /api/experience-listing-preview?locale=en&type=hotel&categories=Culture,Nature&page=1&perPage=6
 */

import type { Endpoint, PayloadRequest } from 'payload'
import { createLogger } from '@/plugins/logging'
import { getTypesenseService, isServiceInitialized } from '@/plugins/typesense'

const logger = createLogger('experience-listing:endpoints')

const quote = (v: string) => '`' + v + '`'
const arrayFilter = (field: string, values: string[]) =>
  `${field}:=[${values.map(quote).join(',')}]`

export function createPreviewEndpoint(): Endpoint {
  return {
    path: '/experience-listing-preview',
    method: 'get',
    handler: async (req: PayloadRequest) => {
      const url = new URL(req.url || '', 'http://localhost')
      const locale = url.searchParams.get('locale') || req.locale || 'en'
      const page = parseInt(url.searchParams.get('page') || '1', 10)
      const perPage = parseInt(url.searchParams.get('perPage') || '6', 10)

      // Parse filter params
      const type = url.searchParams.get('type')?.split(',').filter(Boolean)
      const categories = url.searchParams.get('categories')?.split(',').filter(Boolean)
      const tags = url.searchParams.get('tags')?.split(',').filter(Boolean)
      const region = url.searchParams.get('region')?.split(',').filter(Boolean)
      const municipality = url.searchParams.get('municipality')?.split(',').filter(Boolean)
      const city = url.searchParams.get('city')?.split(',').filter(Boolean)

      // Resolve category/tag IDs to titles if numeric IDs are passed
      const resolveTitles = async (
        ids: string[] | undefined,
        collection: string,
      ): Promise<string[]> => {
        if (!ids || ids.length === 0) return []

        // If values look like IDs (all numeric), resolve them
        const allNumeric = ids.every((id) => /^\d+$/.test(id))
        if (!allNumeric) return ids

        try {
          const result = await req.payload.find({
            collection: collection as 'categories' | 'tags',
            where: { id: { in: ids.map(Number) } },
            locale: locale as 'en' | 'bg' | 'de' | 'fr' | 'ru',
            depth: 0,
            limit: ids.length,
          })
          return result.docs
            .map((doc) => (doc as unknown as { title?: string }).title)
            .filter((t): t is string => !!t)
        } catch (error) {
          logger.warn('Failed to resolve titles', { collection, ids, error })
          return []
        }
      }

      // Resolve region/municipality/city IDs to names if numeric IDs are passed
      const resolveNames = async (
        ids: string[] | undefined,
        collection: string,
      ): Promise<string[]> => {
        if (!ids || ids.length === 0) return []

        const allNumeric = ids.every((id) => /^\d+$/.test(id))
        if (!allNumeric) return ids

        try {
          const result = await req.payload.find({
            collection: collection as 'regions' | 'municipalities' | 'cities',
            where: { id: { in: ids.map(Number) } },
            locale: locale as 'en' | 'bg' | 'de' | 'fr' | 'ru',
            depth: 0,
            limit: ids.length,
          })
          return result.docs
            .map((doc) => (doc as unknown as { name?: string }).name)
            .filter((n): n is string => !!n)
        } catch (error) {
          logger.warn('Failed to resolve names', { collection, ids, error })
          return []
        }
      }

      if (!isServiceInitialized()) {
        return Response.json(
          { hits: [], found: 0, totalPages: 0 },
          { status: 200 },
        )
      }

      try {
        const categoryTitles = await resolveTitles(categories, 'categories')
        const tagTitles = await resolveTitles(tags, 'tags')
        const regionNames = await resolveNames(region, 'regions')
        const municipalityNames = await resolveNames(municipality, 'municipalities')
        const cityNames = await resolveNames(city, 'cities')

        const service = getTypesenseService()

        const filterExpressions: string[] = []
        if (type?.length) filterExpressions.push(arrayFilter('type', type))
        if (categoryTitles.length > 0)
          filterExpressions.push(arrayFilter('categories.title', categoryTitles))
        if (tagTitles.length > 0) filterExpressions.push(arrayFilter('tags.title', tagTitles))
        if (regionNames.length > 0)
          filterExpressions.push(arrayFilter('region.name', regionNames))
        if (municipalityNames.length > 0)
          filterExpressions.push(arrayFilter('municipality.name', municipalityNames))
        if (cityNames.length > 0)
          filterExpressions.push(arrayFilter('city.name', cityNames))

        const result = await service.search<{
          id: string
          title: string
          slug: string
          type: string
          'heroImage.url'?: string
          'heroImage.alt'?: string
          'city.name': string
        }>('experiences', locale, {
          q: '*',
          queryBy: ['title'],
          filterBy:
            filterExpressions.length > 0 ? filterExpressions.join(' && ') : undefined,
          sortBy: '_text_match:desc',
          page,
          perPage,
        })

        const hits = result.hits.map((hit) => ({
          id: hit.document.id,
          title: hit.document.title,
          slug: hit.document.slug,
          type: hit.document.type,
          city: hit.document['city.name'],
          heroImage: hit.document['heroImage.url']
            ? {
                url: hit.document['heroImage.url'],
                alt: hit.document['heroImage.alt'],
              }
            : undefined,
        }))

        return Response.json({
          hits,
          found: result.found,
          totalPages: Math.ceil(result.found / perPage),
        })
      } catch (error) {
        logger.error('Preview endpoint error', {
          error: error instanceof Error ? error.message : String(error),
        })
        return Response.json(
          { hits: [], found: 0, totalPages: 0 },
          { status: 500 },
        )
      }
    },
  }
}
