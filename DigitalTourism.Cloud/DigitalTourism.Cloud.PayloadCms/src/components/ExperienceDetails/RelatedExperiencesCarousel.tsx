'use client'

import React from 'react'
import { cn, ObjectCardOverlay } from '@/components/ui'
import { CarouselShell } from '@/components/CarouselShell'
import type { ExperienceCardData } from '@/utilities/getExperiencesByType'
import { Section, Container } from '@/components/ui'
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
  const municipality =
    'municipality' in city && typeof city.municipality === 'object' ? city.municipality : null
  const region =
    municipality && 'region' in municipality && typeof municipality.region === 'object'
      ? municipality.region
      : null
  if (region && 'name' in region && region.name) parts.push(region.name as string)
  return parts.length > 0 ? parts.join(', ') : undefined
}

function getTypeName(type?: string): string | undefined {
  if (!type) return undefined
  const names: Record<string, string> = {
    hotel: 'Хотел',
    restaurant: 'Ресторант',
    activity: 'Активност',
    attraction: 'Забележителност',
    event: 'Събитие',
  }
  return names[type]
}

export interface RelatedExperiencesCarouselProps {
  docs: ExperienceCardData[]
  heading?: string
  description?: string
  actionLabel?: string
  className?: string
}

export const RelatedExperiencesCarousel: React.FC<RelatedExperiencesCarouselProps> = ({
  docs,
  heading = 'Разгледай още',
  description = 'Открий още много подобни обекти',
  actionLabel = 'Виж повече',
  className,
}) => {
  if (!docs || docs.length === 0) return null

  return (
    <Section padding="lg" className={cn(className)}>
      <Container>
        {/* Section header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-3xl font-bold leading-[1.15] text-heading md:text-5xl lg:text-[60px]">
            {heading}
          </h2>
          {description && (
            <p className="text-lg font-medium leading-[1.6] text-grey-500">{description}</p>
          )}
        </div>
      </Container>

      {/* Carousel */}
      <Container>
        <CarouselShell
          options={{ loop: true, align: 'start', containScroll: false }}
          showProgress={false}
          slideClassName="basis-[85%] sm:basis-[45%] md:basis-[33.33%] lg:basis-[25%]"
        >
          {docs.map((doc, index) => {
            if (typeof doc === 'string') return null
            const href = buildExperienceUrl(doc.type || 'attraction', doc.slug || '')
            return (
              <ObjectCardOverlay
                key={index}
                image={getImageUrl(doc.heroImage)}
                title={doc.title}
                subtitle={getLocation(doc.city)}
                category={getTypeName(doc.type ?? undefined)}
                href={href}
                actionLabel={actionLabel}
                actionVariant="secondary"
                size="sm"
                className="aspect-[484/594]"
              />
            )
          })}
        </CarouselShell>
      </Container>
    </Section>
  )
}
