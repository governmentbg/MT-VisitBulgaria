'use client'

import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { ObjectCardStandard } from '@/components/ui/composites/ObjectCardStandard'
import { SectionHeader, type SectionHeaderProps } from '@/components/SectionHeader'
import { useTranslations } from 'next-intl'
import { useFavorites } from '@/components/favorites/useFavorites'
import type { ExperienceSearchResult } from '@/lib/search/types'
import type { ViewAllLinkData, SectionVariant } from '../types'
import { useCarouselPosition } from '@/components/CarouselShell/useCarouselPosition'
import { buildExperienceUrl } from '@/utilities/buildExperienceUrl'

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    [query],
  )
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => false, [])
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export interface CarouselStandardProps {
  id?: string
  items: ExperienceSearchResult[]
  heading?: string
  description?: string
  sectionLabel?: string
  viewAllLink?: ViewAllLinkData | null
  headerAlignment?: 'left' | 'center' | 'right'
  sectionVariant?: SectionVariant
  monthFilterSlot?: React.ReactNode
  isFocused?: boolean
}

export const CarouselStandard: React.FC<CarouselStandardProps> = ({
  id,
  items,
  heading,
  description,
  sectionLabel: _sectionLabel,
  viewAllLink,
  headerAlignment,
  sectionVariant,
  monthFilterSlot,
  isFocused = false,
}) => {
  const t = useTranslations('common')

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    //loop: true,
    slidesToScroll: 1,
  })

  useCarouselPosition(id, emblaApi)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  // Track whether 3 slides are visible (lg breakpoint = basis-1/3)
  const isDesktop = useMediaQuery('(min-width: 80rem)')
  // Track xl breakpoint for reduced scale
  const isXl = useMediaQuery('(min-width: 90rem)')
  // Track mobile landscape (3 slides override)
  const isMobLs = useMediaQuery('(orientation: landscape) and (max-width: 63.999rem)')
  // Track whether side arrows should show (wide enough for arrows outside container)
  const isWide = useMediaQuery('(min-width: 108rem)')

  const { toggleFavorite, isFavorite } = useFavorites()

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
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

  const renderCard = (item: ExperienceSearchResult) => (
    <ObjectCardStandard
      compact
      image={item.heroImage?.url || ''}
      title={item.title}
      description={item.description}
      category={item.date ? undefined : item.categories?.[0]}
      date={item.date}
      location={item.location?.city}
      liked={isFavorite(item.id)}
      onLike={() => toggleFavorite(item.id)}
      href={buildExperienceUrl(item.type, item.slug)}
      actionLabel={t('explore')}
    />
  )

  const useCarousel = items.length >= 3
  const shouldFocus = isFocused && items.length > 2
  const isDark = sectionVariant === 'dark' || sectionVariant === 'darkAlt'

  return (
    <div className="container">
      {heading && (
        <SectionHeader
          heading={heading}
          description={description}
          alignment={headerAlignment}
          viewAllLink={viewAllLink as SectionHeaderProps['viewAllLink']}
          className={isDark ? '[&_h2]:text-white [&_p]:text-white/80' : undefined}
        />
      )}
      {monthFilterSlot && <div className="mb-8 -mt-4">{monthFilterSlot}</div>}

      {useCarousel ? (
        <div className="relative z-10">
          {/* Wide-screen arrows (>1700px) — outside carousel, vertically centered */}
          {isWide && (
            <>
              <Button
                variant="secondary"
                size="xs"
                iconOnly
                icon={<SpriteIcon name="chevron-left" />}
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                aria-label="Previous"
                className="absolute -left-16 top-1/2 z-20 flex -translate-y-1/2"
              />
              <Button
                variant="secondary"
                size="xs"
                iconOnly
                icon={<SpriteIcon name="chevron-right" />}
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Next"
                className="absolute -right-16 top-1/2 z-20 flex -translate-y-1/2"
              />
            </>
          )}
          {/* Viewport — vertical padding gives room for scale + shadow without clipping */}
          <div className="lg:pb-20 pb-4 lg:pt-16 overflow-hidden pl-px -ml-px" ref={emblaRef}>
            <div
              className="flex [--slides:1] sm:[--slides:2] md:[--slides:3] [--carousel-gap:0.75rem] md:[--carousel-gap:1rem] lg:[--carousel-gap:2rem] xl:[--carousel-gap:2.5rem] min-[101.25rem]:[--carousel-gap:4.5rem] gap-x-[var(--carousel-gap)]"
              style={isMobLs ? ({ '--slides': '3' } as React.CSSProperties) : undefined}
            >
              {items.map((item, index) => {
                const isCenter = index === selectedIndex + 1

                return (
                  <div
                    key={item.id}
                    className="min-w-0 shrink-0"
                    style={{
                      zIndex: isCenter ? 10 : 1,
                      flexBasis:
                        'calc((100% - ((var(--slides) - 1) * var(--carousel-gap))) / var(--slides))',
                    }}
                  >
                    <div
                      className="h-full"
                      style={{
                        transform:
                          isDesktop && shouldFocus && isCenter
                            ? isXl
                              ? 'scale(1.15)'
                              : 'scale(1.1)'
                            : '',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {renderCard(item)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* Arrows below carousel (<1700px): bottom-right on md+, centered on mobile */}
          {!isWide && (
            <div className="mt-4 flex items-center justify-center gap-2 md:justify-end">
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
          )}
        </div>
      ) : (
        /* Few items — simple flex grid, no carousel */
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="h-full">
              {renderCard(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
