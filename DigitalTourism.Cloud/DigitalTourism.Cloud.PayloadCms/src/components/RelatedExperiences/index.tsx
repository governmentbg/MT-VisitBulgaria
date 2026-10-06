import React from 'react'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/components/ui'
import { ObjectCardStandard } from '@/components/ui/composites/ObjectCardStandard'
import type { ExperienceCardData } from '@/utilities/getExperiencesByType'
import { buildExperienceUrl } from '@/utilities/buildExperienceUrl'

function getImageUrl(heroImage: ExperienceCardData['heroImage']): string {
  if (!heroImage || typeof heroImage === 'string' || typeof heroImage === 'number') return ''
  if ('url' in heroImage && typeof heroImage.url === 'string') return heroImage.url
  return ''
}

function getLocation(city: ExperienceCardData['city']): string | undefined {
  if (!city || typeof city !== 'object') return undefined
  const parts: string[] = []
  if ('name' in city && city.name) parts.push(city.name as string)
  const municipality = 'municipality' in city && typeof city.municipality === 'object' ? city.municipality : null
  const region =
    municipality && 'region' in municipality && typeof municipality.region === 'object'
      ? municipality.region
      : null
  if (region && 'name' in region && region.name) parts.push(region.name as string)
  return parts.length > 0 ? parts.join(', ') : undefined
}

export type RelatedExperiencesProps = {
  className?: string
  docs?: ExperienceCardData[]
}

export const RelatedExperiences: React.FC<RelatedExperiencesProps> = async (props) => {
  const { className, docs } = props
  const t = await getTranslations('experiences')

  if (!docs || docs.length === 0) return null

  return (
    <div className={cn('lg:container', className)}>
      <h3 className="text-2xl font-semibold mb-6">{t('relatedExperiences')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch">
        {docs.map((doc, index) => {
          if (typeof doc === 'string') return null
          const href = buildExperienceUrl(doc.type || 'attraction', doc.slug || '')
          return (
            <ObjectCardStandard
              key={index}
              image={getImageUrl(doc.heroImage)}
              title={doc.title}
              location={getLocation(doc.city)}
              href={href}
              actionLabel={t('viewMore')}
              compact
            />
          )
        })}
      </div>
    </div>
  )
}
