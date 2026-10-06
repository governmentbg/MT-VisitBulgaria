'use server'

import type { Payload } from 'payload'
import { getPayloadClient } from '@/payload/payloadClient'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { revalidatePath } from 'next/cache'
import { toPayloadLocale } from '@/i18n/localization'
import {
  searchExperiences as searchExperiencesOriginal,
  type ExperienceSearchResponse,
} from '@/lib/search'

// Wrapper function to properly expose the server action within this route segment
export async function searchExperiences(params: {
  query: string
  locale: string
  perPage?: number
  page?: number
  filters?: Record<string, unknown>
  sortBy?: string
}): Promise<ExperienceSearchResponse> {
  return searchExperiencesOriginal(params as Parameters<typeof searchExperiencesOriginal>[0])
}

/**
 * Shared populate shape for trip/favorite queries.
 * Only fetches the fields the TripPlanner UI actually renders.
 */
const experiencePopulate = {
  hotels: { title: true, slug: true, heroImage: true, city: true, location: true },
  restaurants: { title: true, slug: true, heroImage: true, city: true, location: true },
  activities: { title: true, slug: true, heroImage: true, city: true, location: true },
  attractions: { title: true, slug: true, heroImage: true, city: true, location: true },
  events: { title: true, slug: true, heroImage: true, city: true, location: true },
  media: { url: true, sizes: true },
  cities: { name: true, coordinates: true },
} as const

type VisitorContext = { user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>; payload: Payload }

/**
 * Resolves the current visitor + payload client once.
 * Call from page components and pass the result to read functions
 * to avoid redundant getCurrentUser() calls.
 */
export async function getVisitorContext(): Promise<VisitorContext | null> {
  const user = await getCurrentUser()
  if (!user || user.collection !== 'visitors') return null
  const payload = await getPayloadClient()
  return { user, payload }
}

export async function getMyTrips(locale: string = 'en', ctx?: VisitorContext | null, options?: { depth?: number }) {
  const resolved = ctx ?? (await getVisitorContext())
  if (!resolved) return []
  const { user, payload } = resolved

  const depth = options?.depth ?? 2

  const trips = await payload.find({
    collection: 'trips',
    where: { visitor: { equals: user.id } },
    depth,
    sort: '-createdAt',
    locale: toPayloadLocale(locale),
    fallbackLocale: 'en',
    select: {
      name: true,
      startDate: true,
      duration: true,
      days: { dayNumber: true, stops: { experience: true, note: true } },
      pool: { experience: true },
    },
    ...(depth >= 2 ? { populate: experiencePopulate } : {}),
  })
  return trips.docs
}

export async function getTrip(id: string, locale: string = 'en', ctx?: VisitorContext | null) {
  const resolved = ctx ?? (await getVisitorContext())
  if (!resolved) return null
  const { user, payload } = resolved

  return payload.findByID({
    collection: 'trips',
    id,
    user,
    depth: 2,
    locale: toPayloadLocale(locale),
    fallbackLocale: 'en',
    select: {
      name: true,
      startDate: true,
      duration: true,
      days: { dayNumber: true, stops: { experience: true, note: true } },
      pool: { experience: true },
    },
    populate: experiencePopulate,
  })
}

/**
 * Lightweight favorites fetch — depth 0, IDs only.
 * Used by useFavorites hook for isFavorite/toggleFavorite checks.
 */
export async function getMyFavorites(ctx?: VisitorContext | null) {
  const resolved = ctx ?? (await getVisitorContext())
  if (!resolved) return []
  const { user, payload } = resolved

  const favorites = await payload.find({
    collection: 'favorites',
    where: { visitor: { equals: user.id } },
    depth: 0,
    limit: 1000,
    select: { experience: true },
  })
  return favorites.docs
}

/**
 * Full favorites fetch — depth 2 with populated experience data.
 * Used by AddDestinationDialog favorites tab (lazy-loaded on tab switch).
 */
export async function getMyFavoriteDestinations(locale: string = 'en') {
  const ctx = await getVisitorContext()
  if (!ctx) return []
  const { user, payload } = ctx

  const favorites = await payload.find({
    collection: 'favorites',
    where: { visitor: { equals: user.id } },
    depth: 2,
    limit: 1000,
    locale: toPayloadLocale(locale),
    fallbackLocale: 'en',
    select: { experience: true },
    populate: experiencePopulate,
  })

  return favorites.docs
    .map((fav) => {
      const exp = fav.experience as any
      if (!exp) return null
      // Unwrap polymorphic { relationTo, value } structure
      const inner = exp.value != null && exp.relationTo
        ? (typeof exp.value === 'object' ? { ...exp.value, type: exp.relationTo } : null)
        : exp
      if (!inner || inner.id == null) return null
      return {
        id: inner.id,
        title: inner.title || '',
        slug: inner.slug || '',
        address: inner.city?.name || '',
        category: inner.type || '',
        imageUrl: inner.heroImage?.sizes?.thumbnail?.url || inner.heroImage?.url || '',
        type: inner.type,
        coordinates: inner.city?.coordinates
          ? { lat: inner.city.coordinates.latitude, lng: inner.city.coordinates.longitude }
          : undefined,
      }
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
}

export async function createTrip(data: { name: string; startDate: string; duration: number }) {
  const user = await getCurrentUser()
  console.log('createTrip: Resolved User Collection:', user?.collection)

  if (!user || user.collection !== 'visitors') {
    if (user && user.collection === 'users') {
      throw new Error(
        'Trip planning is currently available for Visitors only. Please log in with a Visitor account.',
      )
    }
    throw new Error('Unauthorized')
  }

  const payload = await getPayloadClient()

  // Create the trip
  const trip = await payload.create({
    collection: 'trips',
    data: {
      name: data.name,
      startDate: data.startDate,
      duration: data.duration,
      visitor: user.id,
      days: Array.from({ length: data.duration }, (_, i) => ({
        dayNumber: i + 1,
        stops: [],
      })),
    },
  })

  revalidatePath('/account/trips')
  return trip
}

export async function renameTripAction(id: string, name: string) {
  const user = await getCurrentUser()
  if (!user || user.collection !== 'visitors') {
    throw new Error('Unauthorized')
  }

  const payload = await getPayloadClient()

  // Verify ownership
  const existingTrip = await payload.findByID({
    collection: 'trips',
    id,
    user,
  })

  if (!existingTrip) {
    throw new Error('Trip not found or unauthorized')
  }

  await payload.update({
    collection: 'trips',
    id,
    data: { name },
  })

  revalidatePath('/account/trips')
  return { success: true }
}

export async function deleteTrip(id: string) {
  const user = await getCurrentUser()
  if (!user || user.collection !== 'visitors') {
    throw new Error('Unauthorized')
  }

  const payload = await getPayloadClient()

  // Verify ownership
  const existingTrip = await payload.findByID({
    collection: 'trips',
    id,
    user,
  })

  if (!existingTrip) {
    throw new Error('Trip not found or unauthorized')
  }

  await payload.delete({
    collection: 'trips',
    id,
  })

  revalidatePath('/account/trips')
}

import type { Trip } from '@/payload-types'

export async function updateTrip(id: string, data: Partial<Trip>) {
  const user = await getCurrentUser()
  if (!user || user.collection !== 'visitors') {
    throw new Error('Unauthorized')
  }

  const payload = await getPayloadClient()

  // Verify ownership
  const existingTrip = await payload.findByID({
    collection: 'trips',
    id,
    user,
  })

  if (!existingTrip) {
    throw new Error('Trip not found or unauthorized')
  }

  // Validate that all experience IDs exist in the database
  if (data.days || data.pool) {
    const allExperienceIds = new Set<number>()
    const idsByCollection = new Map<string, Set<number>>()

    const trackExp = (exp: { relationTo: string; value: number | { id: number } }) => {
      const rawValue = exp.value
      const expId = typeof rawValue === 'number' ? rawValue : rawValue?.id
      if (expId != null) {
        allExperienceIds.add(expId)
        const ids = idsByCollection.get(exp.relationTo) ?? new Set<number>()
        ids.add(expId)
        idsByCollection.set(exp.relationTo, ids)
      }
    }

    if (data.days) {
      for (const day of data.days) {
        if (day.stops) {
          for (const stop of day.stops) {
            trackExp(stop.experience as any)
          }
        }
      }
    }
    if (data.pool) {
      for (const poolItem of data.pool) {
        trackExp(poolItem.experience as any)
      }
    }

    if (allExperienceIds.size > 0) {
      // Only query collections that are actually referenced
      const results = await Promise.all(
        Array.from(idsByCollection.entries()).map(([slug, ids]) =>
          payload.find({
            collection: slug as any,
            where: { id: { in: Array.from(ids) } },
            limit: ids.size,
            depth: 0,
          }),
        ),
      )

      const foundIds = new Set(results.flatMap((r) => r.docs.map((e) => e.id)))
      const missingIds = Array.from(allExperienceIds).filter((id) => !foundIds.has(id))

      if (missingIds.length > 0) {
        throw new Error(
          `Some experiences no longer exist in the database: ${missingIds.join(', ')}. ` +
            `This may be due to outdated search results. Please refresh the page and try again.`,
        )
      }
    }
  }

  try {
    await payload.update({
      collection: 'trips',
      id,
      data,
    })
  } catch (error) {
    console.error('Update trip error:', error instanceof Error ? error.message : error)
    throw error
  }

  revalidatePath('/account/trips')
  return { success: true }
}
