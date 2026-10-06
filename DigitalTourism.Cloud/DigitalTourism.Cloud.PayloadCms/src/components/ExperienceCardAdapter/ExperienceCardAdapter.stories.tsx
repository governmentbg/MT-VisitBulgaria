import type { Meta, StoryObj } from '@storybook/react'
import { ExperienceCardAdapter } from './index'
import type { ExperienceSearchResult } from '@/lib/search/types'

const meta = {
  title: 'Composites/ExperienceCardAdapter',
  component: ExperienceCardAdapter,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ExperienceCardAdapter>

export default meta
type Story = StoryObj<typeof meta>

const sampleResult: ExperienceSearchResult = {
  id: '1',
  title: 'Grand Hotel Plovdiv',
  slug: 'grand-hotel-plovdiv',
  type: 'hotel',
  description:
    'Experience luxury in the heart of Plovdiv with stunning views of the ancient amphitheatre and award-winning dining.',
  categories: ['Luxury'],
  location: {
    city: 'Plovdiv',
    municipality: 'Plovdiv',
    region: 'Plovdiv Region',
  },
  heroImage: {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    alt: 'Grand Hotel Plovdiv',
  },
  starRating: 4,
}

const eventResult: ExperienceSearchResult = {
  id: '2',
  title: 'Kukerlandia Festival 2026',
  slug: 'kukerlandia-2026',
  type: 'event',
  description: 'The biggest masquerade festival in Bulgaria featuring traditional Kukeri costumes and rituals.',
  categories: ['Festival', 'Culture'],
  location: {
    city: 'Yambol',
    region: 'Yambol Region',
  },
  heroImage: {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    alt: 'Kukerlandia',
  },
  date: '2026-02-26',
  amenities: ['parking', 'food-court'],
}

export const Default: Story = {
  args: {
    result: sampleResult,
    actionLabel: 'View Details',
  },
  decorators: [(Story) => <div className="max-w-[487px]"><Story /></div>],
}

export const WithFavorite: Story = {
  args: {
    result: sampleResult,
    liked: true,
    onLike: () => {},
    actionLabel: 'Explore',
  },
  decorators: [(Story) => <div className="max-w-[487px]"><Story /></div>],
}

export const Event: Story = {
  args: {
    result: eventResult,
    actionLabel: 'View Event',
  },
  decorators: [(Story) => <div className="max-w-[487px]"><Story /></div>],
}
