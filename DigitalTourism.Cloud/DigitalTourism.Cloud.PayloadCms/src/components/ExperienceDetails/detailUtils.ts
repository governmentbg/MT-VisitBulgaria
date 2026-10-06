import type { DeepExperience } from '@/lib/payloadData'
import type { ExperienceType } from '@/collections/Experiences/constants'
import { SLUG_TO_TYPE, TYPE_TO_SLUG } from '@/collections/Experiences/constants'
import type { ExperienceCardData } from '@/utilities/getExperiencesByType'
import type { BreadcrumbItem } from './ExperienceBreadcrumbsBar'

export const typeTranslationKeys: Record<string, string> = {
  hotel: 'hotels',
  restaurant: 'restaurants',
  activity: 'activities',
  attraction: 'attractions',
  event: 'events',
}

export function buildRelatedDocs(experience: DeepExperience): ExperienceCardData[] {
  return (
    (experience.relatedExperiences
      ?.map((rel): ExperienceCardData | null => {
        if (!rel || typeof rel !== 'object') return null
        const doc = rel.value
        if (!doc || typeof doc !== 'object') return null
        return {
          slug: doc.slug,
          title: doc.title,
          type: SLUG_TO_TYPE[rel.relationTo] || rel.relationTo,
          heroImage: doc.heroImage,
          city: doc.city,
        }
      })
      .filter(Boolean) as ExperienceCardData[]) ?? []
  )
}

export function buildBreadcrumbs(
  experience: DeepExperience,
  experienceType: ExperienceType,
  t: (key: string) => string,
  _options?: { includeCity?: boolean },
): BreadcrumbItem[] {
  const typePath = TYPE_TO_SLUG[experienceType]
  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('home'), href: '/' },
    { label: t(typeTranslationKeys[experienceType] || experienceType), href: `/${typePath}` },
  ]
  
  breadcrumbs.push({ label: experience.title })
  return breadcrumbs
}
