'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { RelatedExperiencesCarousel } from './RelatedExperiencesCarousel'
import type { ExperienceCardData } from '@/utilities/getExperiencesByType'

function createMockDocs(count: number): ExperienceCardData[] {
  const types = ['hotel', 'restaurant', 'activity', 'attraction'] as const
  const names = [
    'Рилски манастир',
    'Хотел Марица',
    'Ресторант Воденицата',
    'Белоградчишки скали',
    'Хотел Балкан',
    'Велинград СПА',
    'Пещера Снежанка',
    'Връх Мусала',
  ]

  return Array.from({ length: count }, (_, i) => ({
    slug: `experience-${i}`,
    title: names[i % names.length],
    type: types[i % types.length],
    heroImage: {
      id: i,
      url: `https://picsum.photos/seed/rel${i}/484/594`,
      width: 484,
      height: 594,
      alt: names[i % names.length],
      filename: `img${i}.jpg`,
      mimeType: 'image/jpeg',
      filesize: 50000,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    } as any,
    city: {
      id: i,
      name: 'Благоевград',
      municipality: {
        id: 1,
        name: 'Благоевград',
        region: { id: 1, name: 'Благоевград' },
      },
    } as any,
  }))
}

const meta = {
  title: 'ExperienceDetails/RelatedExperiencesCarousel',
  component: RelatedExperiencesCarousel,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=938:2368',
    },
  },
} satisfies Meta<typeof RelatedExperiencesCarousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    docs: createMockDocs(4),
  },
}

export const ManyItems: Story = {
  args: {
    docs: createMockDocs(8),
  },
}

export const CustomHeading: Story = {
  args: {
    docs: createMockDocs(4),
    heading: 'Подобни обекти',
    description: 'Открийте още интересни места наблизо',
    actionLabel: 'Разгледай',
  },
}
