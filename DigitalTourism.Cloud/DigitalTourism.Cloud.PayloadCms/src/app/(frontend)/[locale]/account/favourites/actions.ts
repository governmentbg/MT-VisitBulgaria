'use server'

import { getPayloadClient } from '@/payload/payloadClient'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { toPayloadLocale } from '@/i18n/localization'
import { SLUG_TO_TYPE } from '@/collections/Experiences/constants'
import type { ExperienceSearchResult } from '@/lib/search/types'

/**
 * Populate shape for favourites — fetches the fields the card UI needs.
 */
const _favouritesPopulate = {
  hotels: {
    title: true,
    slug: true,
    heroImage: true,
    city: true,
    starRating: true,
    categories: true,
    location: true,
  },
  restaurants: {
    title: true,
    slug: true,
    heroImage: true,
    city: true,
    categories: true,
    location: true,
  },
  activities: {
    title: true,
    slug: true,
    heroImage: true,
    city: true,
    categories: true,
    location: true,
  },
  attractions: {
    title: true,
    slug: true,
    heroImage: true,
    city: true,
    categories: true,
    location: true,
  },
  events: {
    title: true,
    slug: true,
    heroImage: true,
    city: true,
    categories: true,
    location: true,
    period: true,
  },
  media: { url: true, alt: true, sizes: true, filename: true },
  cities: { name: true },
  categories: { title: true },
} as const

/**
 * Transform a populated Payload favourite doc into an ExperienceSearchResult.
 */
function favoriteToSearchResult(fav: any): ExperienceSearchResult | null {
  const exp = fav.experience as any
  if (!exp) return null

  // Unwrap polymorphic { relationTo, value } structure
  const relationTo: string | undefined = exp.relationTo
  const inner =
    exp.value != null && relationTo
      ? typeof exp.value === 'object'
        ? exp.value
        : null
      : null
  if (!inner || inner.id == null) return null

  const type =
    (relationTo && SLUG_TO_TYPE[relationTo as keyof typeof SLUG_TO_TYPE]) || relationTo || ''

  const cityName = typeof inner.city === 'object' ? inner.city?.name : undefined

  return {
    id: `${relationTo}_${inner.id}`,
    title: inner.title || '',
    slug: inner.slug || '',
    type,
    location: {
      city: cityName,
      coordinates: inner.location?.coordinates
        ? {
            latitude: inner.location.coordinates.latitude,
            longitude: inner.location.coordinates.longitude,
          }
        : undefined,
    },
    heroImage: {
      url:
        inner.heroImage?.sizes?.medium?.url ||
        inner.heroImage?.sizes?.thumbnail?.url ||
        inner.heroImage?.url ||
        '',
      alt: inner.heroImage?.alt || inner.title || '',
    },
    starRating: inner.starRating ? Number(inner.starRating) : undefined,
    date: inner.period?.startDate || undefined,
    endDate: inner.period?.endDate || undefined,
    categories: Array.isArray(inner.categories)
      ? inner.categories
          .map((c: any) => (typeof c === 'object' ? c.title : c))
          .filter(Boolean)
      : undefined,
  }
}

/**
 * Fetch the current visitor's favourites with populated experience data,
 * transformed into ExperienceSearchResult objects for card rendering.
 */
export async function getMyFavouritesAsSearchResults(
  locale: string,
): Promise<ExperienceSearchResult[]> {
  const user = await getCurrentUser()
  if (!user || user.collection !== 'visitors') return []

  const payload = await getPayloadClient()

  const favorites = await payload.find({
    collection: 'favorites',
    where: { visitor: { equals: user.id } },
    depth: 2,
    limit: 1000,
    locale: toPayloadLocale(locale),
    fallbackLocale: 'en',
  })

  return favorites.docs
    .map(favoriteToSearchResult)
    .filter((r): r is ExperienceSearchResult => r !== null)
}
