import { TYPE_TO_SLUG } from '@/collections/Experiences/constants'

/**
 * Build the frontend URL path for an experience detail page.
 *
 * Accepts either the singular type (`hotel`) or the collection slug (`hotels`).
 * Falls back to `/attractions/{slug}` when the type is unknown.
 *
 * @example buildExperienceUrl('hotel', 'grand-hotel-sofia') => '/hotels/grand-hotel-sofia'
 * @example buildExperienceUrl('hotels', 'grand-hotel-sofia') => '/hotels/grand-hotel-sofia'
 */
export function buildExperienceUrl(type: string, slug: string): string {
  // Try singular type first (e.g. 'hotel' → 'hotels'), then treat as slug directly
  const pathSegment =
    TYPE_TO_SLUG[type as keyof typeof TYPE_TO_SLUG] || type || 'attractions'
  return `/${pathSegment}/${slug}`
}
