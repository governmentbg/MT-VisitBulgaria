'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { ExperienceHeroV2 } from './ExperienceHeroV2'
import type { Media as MediaType } from '@/payload-types'

const mockImage: MediaType = {
  id: 1,
  alt: 'Mountain landscape',
  url: 'https://picsum.photos/seed/hero1/1920/1080',
  width: 1920,
  height: 1080,
  filename: 'hero.jpg',
  mimeType: 'image/jpeg',
  filesize: 100000,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

const meta = {
  title: 'ExperienceDetails/ExperienceHeroV2',
  component: ExperienceHeroV2,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=938:1833',
    },
  },
} satisfies Meta<typeof ExperienceHeroV2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    heroImage: mockImage,
    title: 'Рилски манастир',
  },
}

export const LongTitle: Story = {
  args: {
    heroImage: mockImage,
    title: 'Национален исторически музей „Св. Иван Рилски" и природонаучен музей',
  },
}

export const NoImage: Story = {
  args: {
    heroImage: '' as any,
    title: 'Без изображение',
  },
}
