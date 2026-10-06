import React from 'react'
import { getLocale } from 'next-intl/server'

import type { PagesBlock as PagesBlockProps } from '@/payload-types'
import type { PayloadLocale } from '@/i18n/localization'

import { Section, Container } from '@/components/ui'
import RichText from '@/components/RichText'
import { queryDocuments } from '@/lib/payloadData/server'
import { PagesCarousel } from '@/components/PagesDisplay/PagesCarousel'
import { PagesMasonryGrid } from '@/components/PagesDisplay/PagesMasonryGrid'
import { PagesOrganizer } from './PagesOrganizer'
import type { PageCardData } from '@/components/PagesDisplay/types'

/** Safely extract a URL from a Payload media field, preferring the square size */
function getMediaUrl(media: unknown): string {
  if (!media || typeof media !== 'object') return ''
  const m = media as Record<string, any>
  const squareUrl = m.sizes?.square?.url
  if (typeof squareUrl === 'string' && squareUrl) return squareUrl
  if (typeof m.url === 'string' && m.url) return m.url
  return ''
}

function pageDocToCard(page: any): PageCardData {
  const breadcrumbs = page.breadcrumbs as { url?: string }[] | undefined
  const href = breadcrumbs?.length
    ? breadcrumbs[breadcrumbs.length - 1]?.url || `/${page.slug}`
    : `/${page.slug}`

  return {
    id: page.id,
    image: getMediaUrl(page.hero?.media),
    title: page.title || '',
    href,
  }
}

type Props = PagesBlockProps & { pageId?: number }

export const PagesBlockComponent: React.FC<Props> = async (props) => {
  const { id: blockId, richText, displayMode = 'carousel', populateFrom = 'manual', parentPage, items, limit = 8, pageId } = props

  const locale = (await getLocale()) as PayloadLocale
  let cards: PageCardData[]

  if (populateFrom === 'children') {
    // Resolve parent: explicit selection > current page
    const resolvedParentId = parentPage
      ? (typeof parentPage === 'object' ? parentPage.id : parentPage)
      : pageId
    if (!resolvedParentId) return null

    const result = await queryDocuments<any>({
      collection: 'pages',
      where: { parent: { equals: resolvedParentId } },
      limit: limit ?? 8,
      locale,
      depth: 1,
    })

    cards = result.docs.map(pageDocToCard)
  } else {
    // Manual mode: use the items array
    if (!items?.length) return null

    // Extract page IDs from items
    const pageIds = items
      .map((item) => (typeof item.page === 'object' ? item.page?.id : item.page))
      .filter((id): id is number => typeof id === 'number')

    if (!pageIds.length) return null

    // Batch-fetch all referenced pages
    const result = await queryDocuments<any>({
      collection: 'pages',
      where: { id: { in: pageIds } },
      limit: pageIds.length,
      locale,
      depth: 1,
    })

    // Create a lookup map by page ID
    const pageMap = new Map<number, any>()
    for (const doc of result.docs) {
      pageMap.set(doc.id, doc)
    }

    // Build card data in the order of items (preserving editor ordering)
    cards = []
    for (const item of items) {
      const pid = typeof item.page === 'object' ? item.page?.id : item.page
      if (typeof pid !== 'number') continue

      const page = pageMap.get(pid)
      if (!page) continue

      const image = item.image ? getMediaUrl(item.image) : getMediaUrl(page.hero?.media)
      const title = item.title || page.title || ''
      const breadcrumbs = page.breadcrumbs as { url?: string }[] | undefined
      const href = breadcrumbs?.length
        ? breadcrumbs[breadcrumbs.length - 1]?.url || `/${page.slug}`
        : `/${page.slug}`

      cards.push({ id: pid, image, title, label: item.label || undefined, href })
    }
  }

  if (!cards.length) return null

  if (displayMode === 'organizer') {
    const blockProps = props as any
    return (
      <PagesOrganizer
        heading={blockProps.organizerHeading}
        description={blockProps.organizerDescription}
        ctaLabel={blockProps.organizerCtaLabel}
        ctaUrl={blockProps.organizerCtaUrl}
        items={cards}
      />
    )
  }

  return (
    <Section className='overflow-hidden'>
      <Container>
        {richText && <RichText className="mb-12" data={richText} enableGutter={false} />}
        {displayMode === 'carousel' ? (
          <PagesCarousel id={blockId ?? undefined} items={cards} />
        ) : (
          <PagesMasonryGrid items={cards} />
        )}
      </Container>
    </Section>
  )
}
