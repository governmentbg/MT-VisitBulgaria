'use client'

import React, { useMemo, useCallback } from 'react'
import { cn, Section, Container } from '@/components/ui'
import { GalleryMasonry } from '@/components/GalleryMasonry'
import { mapGalleryMedia } from '@/utilities/mapGalleryMedia'
import type { Media as MediaType } from '@/payload-types'

type GalleryItem = number | MediaType

export interface ExperienceGallerySectionProps {
  gallery: GalleryItem[]
  heading?: string
  description?: string
  showWatermarks?: boolean
  columns?: number
  className?: string
}

export const ExperienceGallerySection: React.FC<ExperienceGallerySectionProps> = ({
  gallery,
  heading = 'Галерия',
  description,
  showWatermarks = true,
  columns = 4,
  className,
}) => {
  const { photos, slides } = useMemo(() => mapGalleryMedia(gallery), [gallery])

  // Responsive columns: min 2 on mobile, scale up to max on desktop
  const responsiveColumns = useCallback(
    (containerWidth: number) => {
      if (containerWidth < 500) return Math.min(2, columns)
      if (containerWidth < 768) return Math.min(3, columns)
      return columns
    },
    [columns],
  )

  if (photos.length === 0) return null

  return (
    <Section
      padding="lg"
      className={cn('relative overflow-hidden', showWatermarks && 'bg-primary-50', className)}
    >
      {showWatermarks && (
        <>
          <img
            src="/watermark.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 bottom-0 h-[800px] w-[900px] opacity-50"
          />
          <img
            src="/watermark.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[900px] w-[900px] opacity-40"
          />
        </>
      )}

      <Container className="relative z-10">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold leading-[1.15] text-heading md:text-5xl lg:text-[60px]">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg font-medium leading-[1.6] text-grey-500">{description}</p>
          )}
        </div>

        {/* Gallery masonry grid */}
        <GalleryMasonry photos={photos} slides={slides} columns={responsiveColumns} />
      </Container>
    </Section>
  )
}
