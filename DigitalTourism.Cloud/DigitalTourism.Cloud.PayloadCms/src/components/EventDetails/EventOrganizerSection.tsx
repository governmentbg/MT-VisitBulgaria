'use client'

import React, { useMemo } from 'react'
import { Section, Container } from '@/components/ui'
import RichText from '@/components/RichText'
import { GalleryMasonry } from '@/components/GalleryMasonry'
import { mapGalleryMedia } from '@/utilities/mapGalleryMedia'
import type { Media as MediaType } from '@/payload-types'

export interface EventOrganizerSectionProps {
  organizerName?: string | null
  organizerDescription?: any
  organizerHighlights?: (number | MediaType)[] | null
  labels: {
    organizer: string
  }
}

export const EventOrganizerSection: React.FC<EventOrganizerSectionProps> = ({
  organizerName,
  organizerDescription,
  organizerHighlights,
  labels,
}) => {
  const { photos, slides } = useMemo(
    () => mapGalleryMedia(organizerHighlights ?? []),
    [organizerHighlights],
  )

  if (!organizerName) return null

  const hasDescription = organizerDescription?.root?.children?.length
  const hasHighlights = photos.length > 0

  if (!hasDescription && !hasHighlights) return null

  return (
    <Section padding="lg">
      <Container>
        <div className="mx-auto max-w-[1066px]">
          <h2 className="font-heading text-3xl font-bold leading-[1.15] text-heading mb-6 md:text-4xl">
            {labels.organizer}: {organizerName}
          </h2>

          {hasDescription && (
            <RichText data={organizerDescription} enableGutter={false} className="prose-lg mb-8" />
          )}

          {hasHighlights && <GalleryMasonry photos={photos} slides={slides} columns={4} />}
        </div>
      </Container>
    </Section>
  )
}
