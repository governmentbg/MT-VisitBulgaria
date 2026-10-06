'use client'

import React, { useMemo } from 'react'

import type { AnyExperience } from '@/collections/Experiences/types'
import { GalleryMasonry } from '@/components/GalleryMasonry'
import { mapGalleryMedia } from '@/utilities/mapGalleryMedia'

type GalleryItem = NonNullable<AnyExperience['gallery']>[number]

interface ExperienceGalleryProps {
  gallery: GalleryItem[]
  title: string
}

const responsiveColumns = (containerWidth: number) => {
  if (containerWidth < 400) return 2
  if (containerWidth < 700) return 3
  return 4
}

export const ExperienceGallery: React.FC<ExperienceGalleryProps> = ({ gallery }) => {
  const { photos, slides } = useMemo(() => mapGalleryMedia(gallery), [gallery])

  if (photos.length === 0) return null

  return (
    <GalleryMasonry
      photos={photos}
      slides={slides}
      columns={responsiveColumns}
      spacing={16}
    />
  )
}
