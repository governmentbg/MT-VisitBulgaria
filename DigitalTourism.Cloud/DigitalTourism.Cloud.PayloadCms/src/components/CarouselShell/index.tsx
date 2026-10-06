'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { cn, Button } from '@/components/ui'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { useCarouselPosition } from './useCarouselPosition'

export interface CarouselShellProps {
  id?: string
  children: React.ReactNode
  options?: EmblaOptionsType
  plugins?: EmblaPluginType[]
  showArrows?: boolean
  showProgress?: boolean
  className?: string
  slideClassName?: string
}

export const CarouselShell: React.FC<CarouselShellProps> = ({
  id,
  children,
  options,
  plugins,
  showArrows = true,
  showProgress = true,
  className,
  slideClassName,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      containScroll: 'trimSnaps',
      ...options,
    },
    plugins,
  )

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

    const scrollProgress = emblaApi.scrollProgress()
    setProgress(Math.max(0, Math.min(1, scrollProgress)))
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

  const slides = React.Children.toArray(children)

  return (
    <div className={cn('relative', className)}>
      {/* Arrows */}
      {showArrows && (canScrollPrev || canScrollNext) && (
        <div className="mb-4 hidden items-center justify-end gap-2 md:flex">
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

      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex md:-ml-6">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                'min-w-0 shrink-0 grow-0 pl-4 md:pl-6 pb-2',
                slideClassName,
              )}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && slides.length > 1 && (
        <div className="mt-6 h-0.5 w-full bg-grey-100">
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${((progress) * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
