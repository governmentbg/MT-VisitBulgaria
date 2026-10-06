import {
  EXPERIENCE_SLUGS,
  SLUG_TO_TYPE,
  TYPE_TO_SLUG,
  type ExperienceSlug,
  type ExperienceType,
} from '@/collections/Experiences/constants'
import type { DestinationItemData } from '@/components/trips'
import type { ExperienceSearchResult } from '@/lib/search/types'

export const generateId = () => Math.random().toString(36).substr(2, 9)

export function parseExperienceId(
  exp: { id: unknown; type?: string },
): { numericId: number; relationTo: ExperienceSlug } | null {
  const raw = exp.id
  let numericId: number
  let slug: string | undefined

  if (typeof raw === 'number') {
    numericId = raw
  } else if (typeof raw === 'string') {
    const underscoreIdx = raw.indexOf('_')
    if (underscoreIdx > 0) {
      slug = raw.slice(0, underscoreIdx)
      numericId = parseInt(raw.slice(underscoreIdx + 1), 10)
    } else {
      numericId = parseInt(raw, 10)
    }
  } else {
    return null
  }

  if (isNaN(numericId) || numericId <= 0) return null

  const expType = exp.type || 'attractions'
  const relationTo = (
    slug && EXPERIENCE_SLUGS.includes(slug as ExperienceSlug)
      ? slug
      : TYPE_TO_SLUG[expType as ExperienceType] || expType
  ) as ExperienceSlug

  return { numericId, relationTo }
}

export function unwrapExperience(exp: any): any {
  if (!exp) return exp
  if (!exp.relationTo || !exp.value) return exp
  const inner = typeof exp.value === 'object' ? exp.value : { id: exp.value }
  return { ...inner, type: SLUG_TO_TYPE[exp.relationTo as ExperienceSlug] || exp.relationTo }
}

export function buildFavoriteKey(destination: DestinationItemData): string | null {
  const raw = destination.type
  if (!raw) return null
  const slug = TYPE_TO_SLUG[raw as ExperienceType] || raw
  return `${slug}_${destination.id}`
}

export function mapHitToDestination(hit: ExperienceSearchResult): DestinationItemData {
  return {
    id: hit.id,
    title: hit.title || '',
    slug: hit.slug || '',
    address: hit.location?.city || '',
    category: hit.type || '',
    imageUrl: hit.heroImage?.url || '',
    type: hit.type as ExperienceSlug | undefined,
    coordinates: hit.location?.coordinates
      ? { lat: hit.location.coordinates.latitude, lng: hit.location.coordinates.longitude }
      : undefined,
  }
}
