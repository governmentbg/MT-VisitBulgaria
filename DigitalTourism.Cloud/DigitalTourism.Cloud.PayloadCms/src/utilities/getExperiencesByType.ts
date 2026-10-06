import { getPayloadClient } from '@/payload/payloadClient'
import type { PayloadLocale } from '@/i18n/localization'
import { TYPE_TO_SLUG, SLUG_TO_TYPE, type ExperienceType } from '@/collections/Experiences/constants'
import type { AnyExperience } from '@/collections/Experiences/types'

export interface ExperienceCardData {
  slug?: string | null
  title: string
  type?: string | null
  heroImage?: AnyExperience['heroImage']
  city?: AnyExperience['city']
}

interface GetExperiencesByTypeOptions {
  type: ExperienceType
  locale: PayloadLocale
  page: number
  limit?: number
}

interface PaginatedExperiences {
  docs: ExperienceCardData[]
  totalDocs: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function getExperiencesByType({
  type,
  locale,
  page,
  limit = 12,
}: GetExperiencesByTypeOptions): Promise<PaginatedExperiences> {
  const payload = await getPayloadClient()
  const collectionSlug = TYPE_TO_SLUG[type]

  // Step 1: Get just the IDs (fast query with no depth, no locale processing)
  const idsResult = await payload.find({
    collection: collectionSlug,
    depth: 0,
    limit,
    page,
    pagination: true,
    overrideAccess: false,
  })

  if (idsResult.docs.length === 0) {
    return {
      docs: [],
      totalDocs: idsResult.totalDocs,
      page: idsResult.page ?? page,
      totalPages: idsResult.totalPages,
      hasNextPage: idsResult.hasNextPage,
      hasPrevPage: idsResult.hasPrevPage,
    }
  }

  // Step 2: Fetch full documents by IDs with locale and depth
  const experiencesResult = await payload.find({
    collection: collectionSlug,
    depth: 1,
    limit,
    locale,
    overrideAccess: false,
    where: {
      id: {
        in: idsResult.docs.map((doc) => doc.id),
      },
    },
  })

  const experienceType = SLUG_TO_TYPE[collectionSlug]
  return {
    docs: experiencesResult.docs.map(doc => ({
      slug: doc.slug,
      title: doc.title,
      type: experienceType,
      heroImage: doc.heroImage,
      city: doc.city,
    })),
    totalDocs: idsResult.totalDocs,
    page: idsResult.page ?? page,
    totalPages: idsResult.totalPages,
    hasNextPage: idsResult.hasNextPage,
    hasPrevPage: idsResult.hasPrevPage,
  }
}
