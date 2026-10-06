'use client'

import React, { useMemo } from 'react'

import type { GalleryBlock as GalleryBlockProps, Media as MediaType } from '@/payload-types'
import { Section, Container } from '@/components/ui'
import { SectionHeader } from '@/components/SectionHeader'
import { ExperienceGallerySection } from '@/components/ExperienceDetails/ExperienceGallerySection'
import { GalleryCarousel } from '@/components/GalleryCarousel'
import { mapGalleryMedia } from '@/utilities/mapGalleryMedia'

export const GalleryBlockComponent: React.FC<GalleryBlockProps> = ({
  layout = 'masonry',
  heading,
  description,
  images,
  columns = '3',
  maxImages = 12,
}) => {
  const allImages = (images ?? []) as (number | MediaType)[]

  if (allImages.length === 0) return null

  const isHorizontal = layout === 'horizontal'

  // Masonry layout: delegate to the shared ExperienceGallerySection component
  if (!isHorizontal) {
    const limitedImages = maxImages ? allImages.slice(0, maxImages) : allImages
    return (
      <ExperienceGallerySection
        gallery={limitedImages}
        heading={heading || undefined}
        description={description || undefined}
        showWatermarks={false}
        columns={parseInt(columns ?? '3', 10)}
      />
    )
  }

  // Horizontal carousel layout (not supported by ExperienceGallerySection)
  const { photos, slides } = mapGalleryMedia(allImages.slice(0, maxImages ?? 12))

  return (
    <Section className="overflow-x-hidden">
      <Container className="pr-0">
        {heading && (
          <SectionHeader
            heading={heading}
            description={description}
            alignment="center"
          />
        )}
        <GalleryCarousel
          photos={photos}
          slides={slides}
          viewportClassName="lg:-mr-[max(1rem,calc((100vw-1620px)/2))]"
        />
      </Container>
    </Section>
  )
}
