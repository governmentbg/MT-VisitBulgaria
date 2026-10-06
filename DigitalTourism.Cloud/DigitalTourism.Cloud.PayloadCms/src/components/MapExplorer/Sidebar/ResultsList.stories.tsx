import type { Meta, StoryObj } from '@storybook/react'
import { ResultsList } from './ResultsList'
import type { MapExplorerPOI } from '../types'

const meta = {
  title: 'MapExplorer/ResultsList',
  component: ResultsList,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResultsList>

export default meta
type Story = StoryObj<typeof meta>

function makePOI(index: number): MapExplorerPOI {
  return {
    id: `poi-${index}`,
    title: ['National History Museum', 'Alexander Nevsky Cathedral', 'Vitosha Mountain', 'Boyana Church', 'NDK'][index % 5]!,
    slug: `poi-${index}`,
    type: 'attraction',
    categories: ['Museums'],
    location: { lat: 42.69 + index * 0.01, lng: 23.32 + index * 0.01 },
    city: 'Sofia',
    heroImageUrl: 'https://placehold.co/400x300',
  }
}

const fivePois = Array.from({ length: 5 }, (_, i) => makePOI(i))

const typeLabels: Record<string, string> = {
  attraction: 'Attraction',
  restaurant: 'Restaurant',
  hotel: 'Hotel',
  event: 'Event',
}

export const Empty: Story = {
  args: {
    pois: [],
    selectedSlug: null,
    totalFound: 0,
    resultsLabel: 'Results',
    typeLabels,
    onSelectPOI: () => {},
  },
}

export const FiveResults: Story = {
  args: {
    pois: fivePois,
    selectedSlug: null,
    totalFound: 5,
    resultsLabel: 'Results',
    typeLabels,
    onSelectPOI: () => {},
  },
}

export const WithSelectedItem: Story = {
  args: {
    pois: fivePois,
    selectedSlug: 'poi-2',
    totalFound: 5,
    resultsLabel: 'Results',
    typeLabels,
    onSelectPOI: () => {},
  },
}
