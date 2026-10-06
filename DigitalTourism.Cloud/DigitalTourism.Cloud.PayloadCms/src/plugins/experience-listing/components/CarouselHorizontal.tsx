'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button, Pill } from '@/components/ui'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { ObjectCardHorizontal } from '@/components/ui/composites/ObjectCardHorizontal'
import { useTranslations } from 'next-intl'
import type { ExperienceSearchResult } from '@/lib/search/types'
import type { ViewAllLinkData, SectionVariant } from '../types'
import { useCarouselPosition } from '@/components/CarouselShell/useCarouselPosition'
import { useFavorites } from '@/components/favorites'
import { buildExperienceUrl } from '@/utilities/buildExperienceUrl'

export interface CarouselHorizontalProps {
  id?: string
  items: ExperienceSearchResult[]
  heading?: string
  description?: string
  sectionLabel?: string
  viewAllLink?: ViewAllLinkData | null
  headerAlignment?: 'left' | 'center' | 'right'
  sectionVariant?: SectionVariant
  monthFilterSlot?: React.ReactNode
}

export const CarouselHorizontal: React.FC<CarouselHorizontalProps> = ({
  id,
  items,
  heading,
  description,
  sectionLabel,
  headerAlignment,
  sectionVariant = 'dark',
  monthFilterSlot,
}) => {
  const t = useTranslations('common')
  const { toggleFavorite, isFavorite } = useFavorites()

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    slidesToScroll: 2,
    loop: true,
    breakpoints: {
      '(max-width: 80rem)': { slidesToScroll: 1 },
    },
  })

  useCarouselPosition(id, emblaApi)

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [progress, setProgress] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())))
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

  return (
    <>
      {/* Header */}
      <div className="container relative z-10">
        <div className={`mb-10 flex flex-col ${headerAlignment === 'right' ? 'items-end text-right' : headerAlignment === 'left' ? 'items-start text-left' : 'items-center text-center'}`}>
          {sectionLabel && (
            <Pill variant="brand" size="md" className="mb-3">
              {sectionLabel}
            </Pill>
          )}
          {heading && (
            <h2 className={`font-heading text-2xl font-bold leading-tight md:text-3xl lg:text-[3.75rem] lg:leading-[1.15] ${headingColor}`}>
              {heading}
            </h2>
          )}
          {description && (
            <p className={`mt-3 max-w-2xl text-base font-medium leading-relaxed lg:text-lg ${bodyColor}`}>
              {description}
            </p>
          )}
          {monthFilterSlot && <div className="mt-4">{monthFilterSlot}</div>}
        </div>
      </div>

      {/* Carousel + nav — full width viewport for both-sides peek */}
      <div className="relative z-10 overflow-hidden" ref={emblaRef}>
          <div className="-ml-8 flex items-stretch">
            {items.map((item) => (
              <div
                key={item.id}
                className="min-w-0 pl-8 shrink-0 grow-0 w-[100%] sm:w-[20rem] md:w-[30rem] lg:w-[40rem]"
              >
                <ObjectCardHorizontal
                  className="h-full"
                  image={item.heroImage?.url || ''}
                  title={item.title}
                  description={item.description}
                  category={item.categories?.[0]}
                  liked={isFavorite(item.id)}
                  onLike={() => toggleFavorite(item.id)}
                  href={buildExperienceUrl(item.type, item.slug)}
                  actionLabel={t('explore')}
                />
              </div>
            ))}
          </div>

          {/* Progress bar (left) + arrows (right) — max-w aligns with card pair */}
          {(canScrollPrev || canScrollNext) && <div className="mx-auto mt-8 flex max-w-[78rem] items-center justify-between lg:px-0">
            <div className="h-[0.125rem] w-[7.5rem] bg-white/20 sm:w-[12.5rem] lg:w-[18.75rem]">
              <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
            </div>
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
          </div>}
        </div>
    </>
  )
}
