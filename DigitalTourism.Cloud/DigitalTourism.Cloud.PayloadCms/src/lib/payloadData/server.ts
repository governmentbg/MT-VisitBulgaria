/**
 * Generic Server-Side Payload Query Utilities
 *
 * Centralized query functions that work with ANY Payload collection.
 * Uses React cache() for request-level deduplication.
 */

import { cache } from 'react'
import { getPayloadClient } from '@/payload/payloadClient'
import type { Where } from 'payload'
import type { Config } from '@/payload-types'
import type { PayloadLocale } from '@/i18n/localization'
import { multiSearch } from '@/plugins/typesense/search'
import { SLUG_TO_TYPE } from '@/collections/Experiences/constants'
import type { ExperienceSlug } from '@/collections/Experiences/constants'
import localization from '@/i18n/localization'
import { getHomePageId } from '@/utilities/getSettings'
import type {
  Depth,
  HotelAtDepth,
  RestaurantAtDepth,
  ActivityAtDepth,
  AttractionAtDepth,
  EventAtDepth,
  PageAtDepth,
  ShallowExperience,
  MetaDoc,
} from './types'

/**
 * Generic query for any Payload collection by slug
 *
 * @template T - The document type (Hotel, Post, Page, etc.)
 * @template D - The depth level (0-4)
 *
 * @example
 * ```typescript
 * // Query activity with depth 2 (default)
 * const activity = await queryDocumentBySlug<Activity>({
 *   collection: 'activities',
 *   slug: 'hiking-trail',
 *   locale: 'en',
 *   draft: false,
 * })
 *
 * // Query post with depth 1
 * const post = await queryDocumentBySlug<Post, 1>({
 *   collection: 'posts',
 *   slug: 'my-post',
 *   locale: 'en',
 *   depth: 1,
 *   draft: true,
 * })
 * ```
 */
export const queryDocumentBySlug = cache(
  async <T, D extends Depth = 2>({
    collection,
    slug,
    locale,
    depth = 2 as D,
    draft = false,
  }: {
    collection: keyof Config['collections']
    slug: string
    locale?: PayloadLocale
    depth?: D
    draft?: boolean
  }): Promise<T | null> => {
    const payload = await getPayloadClient()
    const defaultLocale = localization.defaultLocale

    const result = await payload.find({
      collection,
      draft,
      locale,
      fallbackLocale: defaultLocale,
      limit: 1,
      depth,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: { equals: slug },
      },
    })

    if (result.docs?.[0]) return result.docs[0] as T

    // Fallback: if locale-specific slug is missing, try the default locale
    if (locale && locale !== defaultLocale) {
      const fallbackResult = await payload.find({
        collection,
        draft,
        locale: defaultLocale,
        limit: 1,
        depth,
        overrideAccess: draft,
        pagination: false,
        where: {
          slug: { equals: slug },
        },
      })
      return (fallbackResult.docs?.[0] as T) || null
    }

    return null
  },
)

/**
 * Generic query for documents by ID
 *
 * @template T - The document type
 * @template D - The depth level (0-4)
 */
export const queryDocumentById = cache(
  async <T, D extends Depth = 2>({
    collection,
    id,
    locale,
    depth = 2 as D,
    draft = false,
  }: {
    collection: keyof Config['collections']
    id: number | string
    locale?: PayloadLocale
    depth?: D
    draft?: boolean
  }): Promise<T | null> => {
    const payload = await getPayloadClient()

    try {
      const result = await payload.findByID({
        collection,
        id,
        draft,
        locale,
        depth,
        overrideAccess: draft,
      })

      return (result as T) || null
    } catch (_error) {
      // Document not found
      return null
    }
  },
)

/**
 * Generic query for multiple documents
 *
 * @template T - The document type
 * @template D - The depth level (0-4)
 */
export const queryDocuments = cache(
  async <T, D extends Depth = 1>({
    collection,
    where,
    limit = 10,
    page = 1,
    locale,
    depth = 1 as D,
    sort,
    draft = false,
  }: {
    collection: keyof Config['collections']
    where?: Where
    limit?: number
    page?: number
    locale?: PayloadLocale
    depth?: D
    sort?: string
    draft?: boolean
  }): Promise<{
    docs: T[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection,
      where,
      limit,
      page,
      draft,
      locale,
      depth,
      overrideAccess: draft,
      pagination: true,
      sort,
    })

    return result as any
  },
)

/**
 * Collection-Specific Query Helpers
 *
 * Convenient wrappers for querying specific collections by slug.
 * These provide automatic type inference without manual generic casting.
 *
 * @example
 * ```typescript
 * // No manual type casting needed!
 * const activity = await getActivityDetails({ slug: 'hiking', locale: 'en', draft: false })
 * // activity is automatically typed as ActivityAtDepth<2>
 * ```
 */

/**
 * Get hotel details by slug with automatic depth-aware typing (default depth: 2)
 */
export const getHotelDetails = async <D extends Depth = 2>(params: {
  slug: string
  locale?: PayloadLocale
  depth?: D
  draft?: boolean
}): Promise<HotelAtDepth<D> | null> => {
  return queryDocumentBySlug<HotelAtDepth<D>, D>({
    collection: 'hotels',
    ...params,
  })
}

/**
 * Get restaurant details by slug with automatic depth-aware typing (default depth: 2)
 */
export const getRestaurantDetails = async <D extends Depth = 2>(params: {
  slug: string
  locale?: PayloadLocale
  depth?: D
  draft?: boolean
}): Promise<RestaurantAtDepth<D> | null> => {
  return queryDocumentBySlug<RestaurantAtDepth<D>, D>({
    collection: 'restaurants',
    ...params,
  })
}

/**
 * Get activity details by slug with automatic depth-aware typing (default depth: 2)
 */
export const getActivityDetails = async <D extends Depth = 2>(params: {
  slug: string
  locale?: PayloadLocale
  depth?: D
  draft?: boolean
}): Promise<ActivityAtDepth<D> | null> => {
  return queryDocumentBySlug<ActivityAtDepth<D>, D>({
    collection: 'activities',
    ...params,
  })
}

/**
 * Get attraction details by slug with automatic depth-aware typing (default depth: 2)
 */
export const getAttractionDetails = async <D extends Depth = 2>(params: {
  slug: string
  locale?: PayloadLocale
  depth?: D
  draft?: boolean
}): Promise<AttractionAtDepth<D> | null> => {
  return queryDocumentBySlug<AttractionAtDepth<D>, D>({
    collection: 'attractions',
    ...params,
  })
}

/**
 * Get event details by slug with automatic depth-aware typing (default depth: 2)
 */
export const getEventDetails = async <D extends Depth = 2>(params: {
  slug: string
  locale?: PayloadLocale
  depth?: D
  draft?: boolean
}): Promise<EventAtDepth<D> | null> => {
  return queryDocumentBySlug<EventAtDepth<D>, D>({
    collection: 'events',
    ...params,
  })
}

/**
 * Get page details by slug with automatic depth-aware typing (default depth: 2)
 */
export const getPageDetails = async <D extends Depth = 2>(params: {
  slug: string
  locale?: PayloadLocale
  depth?: D
  draft?: boolean
}): Promise<PageAtDepth<D> | null> => {
  return queryDocumentBySlug<PageAtDepth<D>, D>({
    collection: 'pages',
    ...params,
  })
}

/**
 * Lightweight Metadata Queries
 *
 * These use Payload's `select` API to fetch only the fields needed by generateMeta(),
 * avoiding the overhead of loading full documents (galleries, related experiences, etc.).
 */

/** Fetch only metadata-relevant fields for an experience document */
export const getExperienceMetaDoc = cache(
  async ({
    collection,
    slug,
    locale,
  }: {
    collection: ExperienceSlug
    slug: string
    locale?: PayloadLocale
  }): Promise<MetaDoc | null> => {
    const payload = await getPayloadClient()

    const defaultLocale = localization.defaultLocale

    const result = await payload.find({
      collection,
      locale,
      fallbackLocale: defaultLocale,
      limit: 1,
      depth: 1,
      pagination: false,
      select: {
        title: true,
        slug: true,
        heroImage: true,
        description: true,
      },
      where: { slug: { equals: slug } },
    })

    return (result.docs?.[0] as unknown as MetaDoc) || null
  },
)

/** Fetch only metadata-relevant fields for a page document */
export const getPageMetaDoc = cache(
  async ({
    path,
    locale,
  }: {
    path: string
    locale?: PayloadLocale
  }): Promise<MetaDoc | null> => {
    const payload = await getPayloadClient()
    const defaultLocale = localization.defaultLocale

    const selectFields = {
      title: true,
      slug: true,
      meta: true,
      breadcrumbs: true,
      parent: true,
    } as const

    // Home page
    if (path === '/') {
      const homePageId = await getHomePageId()

      if (homePageId) {
        const page = await payload.findByID({
          collection: 'pages',
          id: homePageId,
          locale,
          fallbackLocale: defaultLocale,
          depth: 1,
          select: selectFields,
        })
        if (page) return page as unknown as MetaDoc
      }

      // Fallback: slug === 'home'
      const result = await payload.find({
        collection: 'pages',
        locale,
        fallbackLocale: defaultLocale,
        limit: 1,
        depth: 1,
        pagination: false,
        select: selectFields,
        where: { slug: { equals: 'home' } },
      })
      return (result.docs?.[0] as unknown as MetaDoc) || null
    }

    // Nested pages — match by slug + breadcrumb path
    const slug = path.split('/').filter(Boolean).pop()
    if (!slug) return null

    const result = await payload.find({
      collection: 'pages',
      locale,
      fallbackLocale: defaultLocale,
      limit: 10,
      depth: 1,
      pagination: false,
      select: selectFields,
      where: { slug: { equals: slug } },
    })

    for (const page of result.docs || []) {
      const lastBreadcrumb = page.breadcrumbs?.[page.breadcrumbs.length - 1]
      if (lastBreadcrumb?.url === path) {
        return page as unknown as MetaDoc
      }
      if (!page.parent && path === `/${slug}`) {
        return page as unknown as MetaDoc
      }
    }

    return null
  },
)

/**
 * Unified Experiences Query using Typesense
 *
 * Searches across ALL experience collections (hotels, restaurants, activities, attractions, events)
 * in a SINGLE request using Typesense's multiSearch.
 *
 * Benefits:
 * - 1 request instead of 5 separate queries
 * - Unified sorting across all collections
 * - Better performance with Typesense
 * - Properly typed results
 *
 * @example
 * ```typescript
 * const experiences = await queryAllExperiences({
 *   limit: 10,
 *   locale: 'en',
 *   query: 'hotel', // optional search query
 *   sort: 'createdAt:desc',
 * })
 * ```
 */
export const queryAllExperiences = cache(
  async (params: {
    limit?: number
    locale?: PayloadLocale
    query?: string
    sort?: string
  }): Promise<ShallowExperience[]> => {
    const { limit = 10, locale = 'en', query = '*', sort = 'createdAt:desc' } = params

    const experienceCollections = ['hotels', 'restaurants', 'activities', 'attractions', 'events'] as const

    // Use Typesense multiSearch to query all collections in a single request
    const results = await multiSearch(
      experienceCollections.map((collection) => ({
        collection,
        locale,
        params: {
          q: query,
          queryBy: ['title', 'description'],
          perPage: Math.ceil(limit / experienceCollections.length) + 2, // Fetch slightly more to ensure we have enough after sorting
          sortBy: sort,
        },
      })),
    )

    // Flatten all results and add type information
    const allExperiences: ShallowExperience[] = results.flatMap((result, index) => {
      const collection = experienceCollections[index]
      const type = SLUG_TO_TYPE[collection]

      return result.hits.map((hit) => ({
        ...(hit.document as any),
        type,
      }))
    })

    // Sort by the specified field across all collections and limit
    if (sort) {
      const [sortField, sortOrder] = sort.split(':')
      allExperiences.sort((a: any, b: any) => {
        const aVal = a[sortField]
        const bVal = b[sortField]

        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1
        }
        return aVal > bVal ? 1 : -1
      })
    }

    return allExperiences.slice(0, limit)
  },
)
