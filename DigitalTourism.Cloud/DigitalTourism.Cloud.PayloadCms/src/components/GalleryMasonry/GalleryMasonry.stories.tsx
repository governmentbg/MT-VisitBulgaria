'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import type { Photo } from 'react-photo-album'
import type { Slide } from 'yet-another-react-lightbox'
import { GalleryMasonry } from './index'
import { Container } from '@/components/ui'

/**
 * Mimics real CMS content: all images are ~3:2 landscape crops (900x600)
 * from the Payload medium size. The buildBalancedPhotos algorithm in
 * GalleryMasonry assigns varied heights to create the masonry effect.
 */
function createMockData(count: number): { photos: Photo[]; slides: Slide[] } {
  const photos: Photo[] = []
  const slides: Slide[] = []

  // Slight variations around 900x600 to match real CMS medium crops
  const dimensions = [
    { width: 900, height: 600 },
    { width: 900, height: 600 },
    { width: 900, height: 601 },
    { width: 900, height: 600 },
    { width: 900, height: 600 },
    { width: 900, height: 594 },
    { width: 900, height: 600 },
    { width: 900, height: 601 },
    { width: 900, height: 600 },
    { width: 900, height: 601 },
    { width: 900, height: 600 },
    { width: 900, height: 600 },
  ]

  for (let i = 0; i < count; i++) {
    const dim = dimensions[i % dimensions.length]
    const src = `https://picsum.photos/seed/gallery${i}/${dim.width}/${dim.height}`
    photos.push({ src, width: dim.width, height: dim.height, alt: `Photo ${i + 1}` })
    slides.push({ src, width: dim.width, height: dim.height, alt: `Photo ${i + 1}` })
  }

  return { photos, slides }
}

const meta = {
  title: 'Components/GalleryMasonry',
  component: GalleryMasonry,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <Container className="py-16">
        <Story />
      </Container>
    ),
  ],
} satisfies Meta<typeof GalleryMasonry>

export default meta
type Story = StoryObj<typeof meta>

const tenImages = createMockData(10)
const nineImages = createMockData(9)
const threeImages = createMockData(3)
const twelveImages = createMockData(12)
const fiveImages = createMockData(5)

/** 10 images / 3 columns — matches the production tourism-types page */
export const Default: Story = {
  args: {
    photos: tenImages.photos,
    slides: tenImages.slides,
    columns: 3,
    spacing: 32,
  },
}

export const NineImages: Story = {
  args: {
    photos: nineImages.photos,
    slides: nineImages.slides,
    columns: 3,
    spacing: 32,
  },
}

export const TwoColumns: Story = {
  args: {
    photos: nineImages.photos,
    slides: nineImages.slides,
    columns: 2,
    spacing: 32,
  },
}

export const FourColumns: Story = {
  args: {
    photos: twelveImages.photos,
    slides: twelveImages.slides,
    columns: 4,
    spacing: 32,
  },
}

export const FewImages: Story = {
  args: {
    photos: threeImages.photos,
    slides: threeImages.slides,
    columns: 3,
    spacing: 32,
  },
}

export const FiveImages: Story = {
  args: {
    photos: fiveImages.photos,
    slides: fiveImages.slides,
    columns: 3,
    spacing: 32,
  },
}

export const SingleColumn: Story = {
  args: {
    photos: threeImages.photos,
    slides: threeImages.slides,
    columns: 1,
    spacing: 16,
  },
}
