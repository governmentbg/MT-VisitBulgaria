'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui'
import { CMSLink } from '@/components/Link'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { ObjectCardOverlay } from '@/components/ui/composites/ObjectCardOverlay'
import { ObjectCardStandard } from '@/components/ui/composites/ObjectCardStandard'
import { useFavorites } from '@/components/favorites/useFavorites'
import { useLocale, useTranslations } from 'next-intl'
import type { ExperienceSearchResult } from '@/lib/search/types'
import type { ViewAllLinkData, SectionVariant } from '../types'
import { useCarouselPosition } from '@/components/CarouselShell/useCarouselPosition'
import { buildExperienceUrl } from '@/utilities/buildExperienceUrl'

function formatEventSubtitle(item: ExperienceSearchResult, locale: string): string[] | undefined {
  if (item.type !== 'event' || !item.date) return undefined

  const start = new Date(item.date)
  const end = item.endDate ? new Date(item.endDate) : null

  const fmt = (d: Date) =>
    d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase()

  let dateLine: string
  if (end && end.getTime() !== start.getTime()) {
    dateLine = `${fmt(start)} - ${fmt(end)}`
  } else {
    dateLine = fmt(start)
  }

  const lines = [dateLine]
  const location = [item.location?.city, item.location?.region].filter(Boolean).join(', ')
  if (location) lines.push(location)

  return lines
}

export interface CarouselOverlayProps {
  id?: string
  items: ExperienceSearchResult[]
  heading?: string
  description?: string
  sectionLabel?: string
  viewAllLink?: ViewAllLinkData | null
  headerAlignment?: 'left' | 'center' | 'right'
  actionLabel?: string
  sectionVariant?: SectionVariant
  monthFilterSlot?: React.ReactNode
  overlayCardStyle?: 'overlay' | 'standard'
  overlayLayout?: 'sideBySide' | 'stacked'
}

export const CarouselOverlay: React.FC<CarouselOverlayProps> = ({
  id,
  items,
  heading,
  description,
  sectionLabel: _sectionLabel,
  viewAllLink,
  headerAlignment,
  actionLabel,
  sectionVariant = 'dark',
  monthFilterSlot,
  overlayCardStyle = 'overlay',
  overlayLayout = 'sideBySide',
}) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const locale = useLocale()
  const t = useTranslations('common')
  const resolvedActionLabel = actionLabel ?? t('explore')

  // Standard cards show 3 per view; only loop when there are more items than visible
  const needsLoop = overlayCardStyle === 'standard' ? items.length > 3 : items.length > 2
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: needsLoop ? false : 'trimSnaps',
    slidesToScroll: 1,
    loop: false
    //loop: needsLoop,
  })

  useCarouselPosition(id, emblaApi)

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const isDark = sectionVariant === 'dark' || sectionVariant === 'darkAlt'
  const headingColor = isDark ? 'text-white' : 'text-grey-900'
  const bodyColor = isDark ? 'text-white/80' : 'text-grey-700'

  const hasViewAll = viewAllLink?.url || viewAllLink?.reference

  const renderCard = (item: ExperienceSearchResult) => {
    const href = buildExperienceUrl(item.type, item.slug)
    if (overlayCardStyle === 'standard') {
      return (
        <ObjectCardStandard
          image={item.heroImage?.url || ''}
          title={item.title}
          description={item.description}
          category={item.date ? undefined : item.categories?.[0]}
          date={item.date}
          location={item.location?.city}
          href={href}
          actionLabel={resolvedActionLabel}
          liked={isFavorite(item.id)}
          onLike={() => toggleFavorite(item.id)}
        />
      )
    }
    const eventSubtitle = formatEventSubtitle(item, locale)
    return (
      <ObjectCardOverlay
        image={item.heroImage?.url || ''}
        title={item.title}
        subtitle={eventSubtitle || item.description}
        category={item.categories?.[0]}
        href={href}
        actionLabel={resolvedActionLabel}
        actionVariant="secondary"
        liked={isFavorite(item.id)}
        onLike={() => toggleFavorite(item.id)}
        className="lg:aspect-[43/53]"
      />
    )
  }

  const isStandard = overlayCardStyle === 'standard'
  const slideClass = isStandard
    ? 'min-w-0 shrink-0 grow-0 pl-5 lg:pl-[4.8125rem] basis-[85%] mob-ls:basis-[33%] sm:basis-[50%] lg:basis-[35.25rem]'
    : 'min-w-0 shrink-0 grow-0 pl-5 basis-[85%] sm:basis-[33%] lg:basis-[26.875rem]'

  const carouselSlides = (
    <div className={isStandard ? 'overflow-hidden pb-6' : 'overflow-hidden'} ref={emblaRef}>
      <div className={`${isStandard ? '-ml-5 lg:-ml-[4.8125rem]' : '-ml-5'} flex items-stretch`}>
        {items.map((item) => (
          <div key={item.id} className={slideClass}>
            {renderCard(item)}
          </div>
        ))}
      </div>
    </div>
  )

  const hasArrows = canScrollPrev || canScrollNext

  const arrows = (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="xs"
        iconOnly
        icon={<SpriteIcon name="chevron-left" />}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous"
      />
      <Button
        variant="secondary"
        size="xs"
        iconOnly
        icon={<SpriteIcon name="chevron-right" />}
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next"
      />
    </div>
  )

  // ─── Stacked layout ───
  if (overlayLayout === 'stacked') {
    return (
      <div className="container">
        {/* Header row */}
        <div className={`mb-8 flex items-end gap-4 ${headerAlignment === 'center' ? 'justify-center text-center' : headerAlignment === 'right' ? 'justify-end text-right' : 'justify-between'}`}>
          <div className={`flex flex-col gap-2 ${headerAlignment === 'center' ? 'items-center' : headerAlignment === 'right' ? 'items-end' : ''}`}>
            {heading && (
              <h2 className={`font-heading text-2xl font-bold leading-tight md:text-3xl lg:text-4xl ${headingColor}`}>
                {heading}
              </h2>
            )}
            {description && (
              <p className={`max-w-md text-base font-medium leading-relaxed ${bodyColor}`}>
                {description}
              </p>
            )}
          </div>
          {hasViewAll && (
            <div className="shrink-0">
              <CMSLink {...(viewAllLink as React.ComponentProps<typeof CMSLink>)} appearance="primary" size="sm" />
            </div>
          )}
        </div>
        {monthFilterSlot && <div className="mb-6 -mt-2">{monthFilterSlot}</div>}

        {/* Full-width carousel */}
        <div className="-mr-[max(1rem,calc((100vw-var(--container-max,80rem))/2))]">
          {carouselSlides}
        </div>

        {/* Arrows bottom-right */}
        {hasArrows && <div className="mt-4 flex justify-end">
          {arrows}
        </div>}
      </div>
    )
  }

  // ─── Side-by-side layout (default) ───
  return (
    <div className="container pr-0 lg:py-4">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-12">
        {/* Left column: heading + description (top), arrows (bottom) */}
        <div className="flex flex-col lg:w-1/3 lg:shrink-0">
          <div className="flex flex-col gap-4">
            {heading && (
              <h2 className={`font-heading text-2xl font-bold leading-tight md:text-3xl lg:text-4xl ${headingColor}`}>
                {heading}
              </h2>
            )}
            {description && (
              <p className={`max-w-md text-base font-medium leading-relaxed ${bodyColor}`}>
                {description}
              </p>
            )}
          </div>
          {monthFilterSlot && <div className="mt-4">{monthFilterSlot}</div>}

            {/* Arrows anchored to bottom-left */}
            {hasArrows && <div className="mt-8 hidden items-center gap-2 lg:mt-auto lg:flex">
              {arrows}
            </div>}
          </div>

          {/* Right column: carousel — overflows right to show peeking cards */}
          <div className="min-w-0 flex-1 lg:-mr-[max(1rem,calc((100vw-var(--container-max,80rem))/2))]">
            {carouselSlides}

            {/* Mobile arrows */}
            {hasArrows && <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
              {arrows}
            </div>}
          </div>
        </div>
      </div>
  )
}
