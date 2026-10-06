// @ts-nocheck — Block removed from editor; component retained for reference
import React from 'react'
import { getLocale } from 'next-intl/server'

import type { FeaturedEventsBlock as FeaturedEventsBlockProps } from '@/payload-types'
import type { PayloadLocale } from '@/i18n/localization'

import { Section, Container, ObjectCardOverlay, ObjectCardStandard } from '@/components/ui'
import { SectionHeader } from '@/components/SectionHeader'
import { search } from '@/plugins/typesense/search'
import { queryDocumentById, queryDocuments } from '@/lib/payloadData/server'

type EventCard = {
  id: number | string
  image: string
  title: string
  description?: string
  category?: string
  date?: string
  location?: string
  href: string
}

interface TypesenseEvent {
  id: string
  slug: string
  title: string
  description: string
  type: string
  'categories.title'?: string[]
  'city.name'?: string
  'heroImage.url'?: string
  'heroImage.alt'?: string
  'period.startDate'?: number
  'period.endDate'?: number
}

function formatTimestamp(ts?: number): string | undefined {
  if (!ts) return undefined
  return new Date(ts * 1000).toISOString()
}

function docToCard(doc: any): EventCard {
  return {
    id: doc.id,
    image: doc.heroImage?.url ?? '',
    title: doc.title || '',
    description: doc.description ? String(doc.description).slice(0, 120) : undefined,
    category: doc.categories?.[0]?.title,
    date: doc.period?.startDate,
    location: doc.city?.name,
    href: `/events/${doc.slug || doc.id}`,
  }
}

function typesenseHitToCard(hit: { document: TypesenseEvent }): EventCard {
  return {
    id: hit.document.id,
    image: hit.document['heroImage.url'] ?? '',
    title: hit.document.title,
    description: hit.document.description?.slice(0, 120),
    category: hit.document['categories.title']?.[0],
    date: formatTimestamp(hit.document['period.startDate']),
    location: hit.document['city.name'],
    href: `/events/${hit.document.slug || hit.document.id}`,
  }
}

export const FeaturedEventsBlockComponent: React.FC<FeaturedEventsBlockProps> = async (props) => {
  const {
    heading,
    populateAutomatically,
    featuredEvent: featuredEventRel,
    sideEvents: sideEventsRel,
    sideEventCount = 3,
  } = props

  const locale = (await getLocale()) as PayloadLocale

  let featured: EventCard | null = null
  let sideCards: EventCard[] = []

  if (populateAutomatically) {
    // Auto-populate: use Typesense to find upcoming events sorted by start date
    const totalNeeded = (sideEventCount ?? 3) + 1
    const nowTimestamp = Math.floor(Date.now() / 1000)

    const result = await search<TypesenseEvent>('experiences', locale, {
      q: '*',
      queryBy: ['title', 'description'],
      filterBy: `type:=event && period.startDate:>${nowTimestamp}`,
      sortBy: 'period.startDate:asc',
      perPage: totalNeeded,
    })

    const allCards = result.hits.map(typesenseHitToCard)
    if (allCards.length > 0) {
      featured = allCards[0]
      sideCards = allCards.slice(1)
    }
  } else {
    // Manual mode: fetch selected events via payloadData
    if (featuredEventRel) {
      const featuredId =
        typeof featuredEventRel === 'object' ? featuredEventRel.id : featuredEventRel
      const doc = await queryDocumentById<any>({
        collection: 'events',
        id: featuredId,
        locale,
      })
      if (doc) featured = docToCard(doc)
    }

    if (sideEventsRel?.length) {
      const sideIds = sideEventsRel
        .map((e: { id: number } | number) => (typeof e === 'object' ? e.id : e))
        .filter((id): id is number => typeof id === 'number')

      if (sideIds.length) {
        const result = await queryDocuments<any>({
          collection: 'events',
          where: { id: { in: sideIds } },
          locale,
          depth: 1,
          limit: sideIds.length,
        })
        sideCards = result.docs.map(docToCard)
      }
    }
  }

  if (!featured && !sideCards.length) return null

  return (
    <Section>
      <Container>
        <SectionHeader heading={heading} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Featured event - large card */}
          {featured && (
            <div className="lg:col-span-7">
              <ObjectCardOverlay
                image={featured.image}
                title={featured.title}
                subtitle={featured.category}
                href={featured.href}
                className="h-full "
              />
            </div>
          )}

          {/* Side events - stacked */}
          {sideCards.length > 0 && (
            <div className="flex flex-col gap-6 lg:col-span-5">
              {sideCards.map((event) => (
                <ObjectCardStandard
                  key={event.id}
                  image={event.image}
                  title={event.title}
                  description={event.description}
                  category={event.category}
                  date={event.date}
                  location={event.location}
                  href={event.href}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
