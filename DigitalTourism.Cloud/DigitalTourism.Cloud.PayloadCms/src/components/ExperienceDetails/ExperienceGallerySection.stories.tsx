'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { ExperienceGallerySection } from './ExperienceGallerySection'
import type { Media as MediaType } from '@/payload-types'

function createMockGallery(count: number): MediaType[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    alt: `Gallery image ${i + 1}`,
    url: `https://picsum.photos/seed/gallery${i}/458/594`,
    width: 458,
    height: 594,
    filename: `gallery${i}.jpg`,
    mimeType: 'image/jpeg',
    filesize: 80000,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  }))
}

const meta = {
  title: 'ExperienceDetails/ExperienceGallerySection',
  component: ExperienceGallerySection,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=1465:25680',
    },
  },
} satisfies Meta<typeof ExperienceGallerySection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    gallery: createMockGallery(6),
  },
}

export const FewImages: Story = {
  args: {
    gallery: createMockGallery(3),
  },
}

export const ManyImages: Story = {
  args: {
    gallery: createMockGallery(12),
  },
}

export const CustomHeading: Story = {
  args: {
    gallery: createMockGallery(6),
    heading: 'Снимки',
  },
}
