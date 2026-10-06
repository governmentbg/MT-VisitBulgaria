'use client'

import React, { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import type { Photo } from 'react-photo-album'
import type { Slide } from 'yet-another-react-lightbox'
import { cn, Button } from '@/components/ui'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { lightboxRender } from '@/components/ui/lightboxRender'

export interface GalleryCarouselProps {
  photos: Photo[]
  slides: Slide[]
  className?: string
  /** Applied to the Embla viewport wrapper — use for right-overflow margin */
  viewportClassName?: string
}

const STAGGER_OFFSETS = [0, 70, 120, 40, 90, 30]
const MAX_OFFSET = Math.max(...STAGGER_OFFSETS)

const lightboxPlugins = [Counter, Thumbnails, Zoom]

export const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
  photos,
  slides,
  className,
  viewportClassName,
}) => {
  const [index, setIndex] = useState(-1)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: false,
    loop: false,
  })

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

  const handleClick = useCallback(
    (i: number) => setIndex(i),
    [],
  )

  if (photos.length === 0) return null

  return (
    <div className={cn(className)}>
      {/* Arrows — stay inside container bounds */}
      {(canScrollPrev || canScrollNext) && <div className="mb-4 hidden items-center justify-end gap-2 md:flex">
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
      </div>}

      {/* Viewport — overflows right via viewportClassName negative margin */}
      <div className={cn('overflow-hidden', viewportClassName)} ref={emblaRef}>
        <div className="-ml-4 flex md:-ml-6">
          {photos.map((photo, i) => {
            const offset = STAGGER_OFFSETS[i % STAGGER_OFFSETS.length]
            return (
              <div
                key={photo.src + i}
                className="min-w-0 shrink-0 grow-0 pl-4 basis-[300px] md:basis-[400px] md:pl-6 lg:basis-[458px]"
              >
                <button
                  type="button"
                  className="block w-full cursor-pointer"
                  style={{ paddingTop: offset, paddingBottom: MAX_OFFSET - offset }}
                  onClick={() => handleClick(i)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt ?? ''}
                    width={photo.width}
                    height={photo.height}
                    className="aspect-[458/594] w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={lightboxPlugins}
        render={lightboxRender}
        controller={{ closeOnPullDown: true }}
      />
    </div>
  )
}
