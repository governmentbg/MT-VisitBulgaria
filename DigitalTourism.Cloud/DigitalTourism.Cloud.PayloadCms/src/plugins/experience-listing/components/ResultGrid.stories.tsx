import type { Meta, StoryObj } from '@storybook/react'
import { ResultGrid } from './ResultGrid'
import { NextIntlClientProvider } from 'next-intl'
import type { ExperienceSearchResult } from '@/lib/search/types'

const messages = {
  experienceListing: {
    noResults: 'No results found',
    viewMore: 'View More',
  },
}

const meta = {
  title: 'ExperienceListing/ResultGrid',
  component: ResultGrid,
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ResultGrid>

export default meta
type Story = StoryObj<typeof meta>

const sampleImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'

const makeSample = (i: number): ExperienceSearchResult => ({
  id: String(i),
  title: `Experience ${i}`,
  slug: `experience-${i}`,
  type: ['hotel', 'restaurant', 'activity', 'attraction', 'event'][i % 5]!,
  description: 'A wonderful experience to discover in Bulgaria.',
  categories: ['Culture'],
  location: { city: 'Sofia', region: 'Sofia Region' },
  heroImage: { url: sampleImage, alt: `Experience ${i}` },
  starRating: (i % 5) + 1,
})

const sampleResults = Array.from({ length: 8 }, (_, i) => makeSample(i + 1))

export const Grid2Col: Story = {
  args: {
    results: sampleResults.slice(0, 4),
    gridColumns: 2,
    isLoading: false,
  },
}

export const Grid3Col: Story = {
  args: {
    results: sampleResults.slice(0, 6),
    gridColumns: 3,
    isLoading: false,
  },
}

export const Grid4Col: Story = {
  args: {
    results: sampleResults,
    gridColumns: 4,
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    results: [],
    gridColumns: 3,
    isLoading: true,
    itemsPerPage: 6,
  },
}

export const Empty: Story = {
  args: {
    results: [],
    gridColumns: 3,
    isLoading: false,
  },
}
