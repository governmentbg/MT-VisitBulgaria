'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CarouselStandard } from './CarouselStandard'
import { FavoritesProvider } from '@/components/favorites'
import type { ExperienceSearchResult } from '@/lib/search/types'

function createMockItems(count: number): ExperienceSearchResult[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    title: `Experience ${i + 1}: A Beautiful Mountain Hiking Trail`,
    slug: `experience-${i}`,
    type: 'experience',
    description:
      'Discover the breathtaking scenery of this mountain trail. Perfect for adventurous hikers who love panoramic views and fresh alpine air.',
    categories: ['Hiking'],
    location: { city: 'Tromsø' },
    heroImage: {
      url: `https://picsum.photos/seed/std${i}/800/533`,
      alt: `Experience ${i + 1}`,
    },
  }))
}

const meta = {
  title: 'Plugins/ExperienceListing/CarouselStandard',
  component: CarouselStandard,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <FavoritesProvider>
        <div className="container py-16">
          <Story />
        </div>
      </FavoritesProvider>
    ),
  ],
} satisfies Meta<typeof CarouselStandard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: createMockItems(6),
    heading: 'Popular Experiences',
    description: 'Explore the best experiences in Northern Norway',
  },
}

export const ManyItems: Story = {
  args: {
    items: createMockItems(12),
    heading: 'All Experiences',
  },
}

export const FewItems: Story = {
  args: {
    items: createMockItems(2),
    heading: 'Featured',
  },
}
