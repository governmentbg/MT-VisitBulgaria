'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { Section, Container } from '@/components/ui'
import { PagesCarousel } from './PagesCarousel'
import { PagesMasonryGrid } from './PagesMasonryGrid'
import type { PageCardData } from './types'

// ─── Mock data ───

const sampleImages = [
  'https://picsum.photos/seed/pages-1/800/1000',
  'https://picsum.photos/seed/pages-2/800/1000',
  'https://picsum.photos/seed/pages-3/800/1000',
  'https://picsum.photos/seed/pages-4/800/1000',
  'https://picsum.photos/seed/pages-5/800/1000',
  'https://picsum.photos/seed/pages-6/800/1000',
  'https://picsum.photos/seed/pages-7/800/1000',
  'https://picsum.photos/seed/pages-8/800/1000',
  'https://picsum.photos/seed/pages-9/800/1000',
  'https://picsum.photos/seed/pages-10/800/1000',
  'https://picsum.photos/seed/pages-11/800/1000',
  'https://picsum.photos/seed/pages-12/800/1000',
]

const titles = [
  'Mountain Retreats',
  'Black Sea Coast',
  'Cultural Heritage',
  'Wine & Cuisine',
  'Spa & Wellness',
  'Adventure Sports',
  'Historic Cities',
  'Rural Escapes',
  'Ancient Ruins',
  'Rose Valley',
  'Rhodope Mountains',
  'Danube Trails',
]

const labels = [
  'Nature',
  'Beaches',
  'Culture',
  'Food & Drink',
  'Wellness',
  'Adventure',
  'History',
  'Countryside',
  'Heritage',
  'Seasons',
  'Mountains',
  'Rivers',
]

function mockCards(count: number): PageCardData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `card-${i + 1}`,
    image: sampleImages[i % sampleImages.length],
    title: titles[i % titles.length],
    label: labels[i % labels.length],
    href: '#',
  }))
}

// ─── Showcase component ───

type DisplayMode = 'carousel' | `masonry-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`

const PagesDisplayShowcase: React.FC<{ mode: DisplayMode }> = ({ mode }) => {
  if (mode === 'carousel') {
    return (
      <Section>
        <Container>
          <h2 className="font-heading text-3xl text-center font-extrabold mb-8">Where to start?</h2>
          <PagesCarousel items={mockCards(12)} />
        </Container>
      </Section>
    )
  }

  const count = parseInt(mode.split('-')[1], 10) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  return (
    <Section>
      <Container>
        <h2 className="font-heading text-2xl font-extrabold mb-8">
          Where to start? ({count} {count === 1 ? 'item' : 'items'})
        </h2>
        <PagesMasonryGrid items={mockCards(count)} />
      </Container>
    </Section>
  )
}

// ─── Meta ───

const meta = {
  title: 'Blocks/PagesDisplay',
  component: PagesDisplayShowcase,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    mode: {
      control: 'select',
      options: [
        'carousel',
        'masonry-1',
        'masonry-2',
        'masonry-3',
        'masonry-4',
        'masonry-5',
        'masonry-6',
        'masonry-7',
        'masonry-8',
      ],
    },
  },
} satisfies Meta<typeof PagesDisplayShowcase>

export default meta
type Story = StoryObj<typeof meta>

// ─── Stories ───

export const Carousel: Story = {
  args: { mode: 'carousel' },
  parameters: figmaDesign('40000843:2247'),
}

export const Masonry1: Story = {
  name: 'Masonry — 1 item',
  args: { mode: 'masonry-1' },
}

export const Masonry2: Story = {
  name: 'Masonry — 2 items',
  args: { mode: 'masonry-2' },
}

export const Masonry3: Story = {
  name: 'Masonry — 3 items',
  args: { mode: 'masonry-3' },
}

export const Masonry4: Story = {
  name: 'Masonry — 4 items',
  args: { mode: 'masonry-4' },
  parameters: figmaDesign('907:4693'),
}

export const Masonry5: Story = {
  name: 'Masonry — 5 items',
  args: { mode: 'masonry-5' },
}

export const Masonry6: Story = {
  name: 'Masonry — 6 items',
  args: { mode: 'masonry-6' },
}

export const Masonry7: Story = {
  name: 'Masonry — 7 items',
  args: { mode: 'masonry-7' },
  parameters: figmaDesign('907:3594'),
}

export const Masonry8: Story = {
  name: 'Masonry — 8 items',
  args: { mode: 'masonry-8' },
}
