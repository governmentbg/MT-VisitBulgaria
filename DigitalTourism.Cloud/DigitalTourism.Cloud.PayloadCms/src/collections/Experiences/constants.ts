import type { CollectionLabels } from '@/i18n/admin/types'

export const EXPERIENCE_SLUGS = [
  'hotels',
  'restaurants',
  'activities',
  'attractions',
  'events',
] as const

export type ExperienceSlug = (typeof EXPERIENCE_SLUGS)[number]

/**
 * Maps the experience type value to the collection slug.
 * e.g., 'hotel' → 'hotels'
 */
export const TYPE_TO_SLUG = {
  hotel: 'hotels',
  restaurant: 'restaurants',
  activity: 'activities',
  attraction: 'attractions',
  event: 'events',
} as const satisfies Record<string, ExperienceSlug>

/**
 * Maps the new collection slug to the experience type value.
 * e.g., 'hotels' → 'hotel'
 */
export const SLUG_TO_TYPE = {
  hotels: 'hotel',
  restaurants: 'restaurant',
  activities: 'activity',
  attractions: 'attraction',
  events: 'event',
} as const satisfies Record<ExperienceSlug, string>

/**
 * Experience type string (e.g., 'hotel', 'restaurant').
 * Derived from SLUG_TO_TYPE values.
 */
export type ExperienceType = (typeof SLUG_TO_TYPE)[ExperienceSlug]

/**
 * Maps collection slug to the frontend URL path segment.
 * These match the Next.js route segments in src/app/(frontend)/[locale]/.
 */
export const SLUG_TO_PATH: Record<ExperienceSlug, string> = {
  hotels: 'hotels',
  restaurants: 'restaurants',
  activities: 'activities',
  attractions: 'attractions',
  events: 'events',
}

/**
 * Collection labels for each experience type collection.
 */
export const experienceCollectionLabels: Record<ExperienceSlug, CollectionLabels> = {
  hotels: {
    singular: { en: 'Hotel', bg: 'Хотел' },
    plural: { en: 'Hotels', bg: 'Хотели' },
  },
  restaurants: {
    singular: { en: 'Restaurant', bg: 'Ресторант' },
    plural: { en: 'Restaurants', bg: 'Ресторанти' },
  },
  activities: {
    singular: { en: 'Activity', bg: 'Дейност' },
    plural: { en: 'Activities', bg: 'Дейности' },
  },
  attractions: {
    singular: { en: 'Attraction', bg: 'Атракция' },
    plural: { en: 'Attractions', bg: 'Атракции' },
  },
  events: {
    singular: { en: 'Event', bg: 'Събитие' },
    plural: { en: 'Events', bg: 'Събития' },
  },
}
