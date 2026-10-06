'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import type { Photo } from 'react-photo-album'
import type { Slide } from 'yet-another-react-lightbox'
import { GalleryCarousel } from './index'

function createMockData(count: number): { photos: Photo[]; slides: Slide[] } {
  const photos: Photo[] = []
  const slides: Slide[] = []

  for (let i = 0; i < count; i++) {
    const src = `https://picsum.photos/seed/carousel${i}/458/594`
    photos.push({ src, width: 458, height: 594, alt: `Photo ${i + 1}` })
    slides.push({ src, width: 458, height: 594, alt: `Photo ${i + 1}` })
  }

  return { photos, slides }
}

const meta = {
  title: 'Components/GalleryCarousel',
  component: GalleryCarousel,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="overflow-x-hidden py-16">
        <div className="container pr-0">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    viewportClassName: 'lg:-mr-[max(1rem,calc((100vw-1620px)/2))]',
  },
} satisfies Meta<typeof GalleryCarousel>

export default meta
type Story = StoryObj<typeof meta>

const sixImages = createMockData(6)
const threeImages = createMockData(3)
const twelveImages = createMockData(12)

export const Default: Story = {
  args: {
    photos: sixImages.photos,
    slides: sixImages.slides,
  },
}

export const FewImages: Story = {
  args: {
    photos: threeImages.photos,
    slides: threeImages.slides,
  },
}

export const ManyImages: Story = {
  args: {
    photos: twelveImages.photos,
    slides: twelveImages.slides,
  },
}
