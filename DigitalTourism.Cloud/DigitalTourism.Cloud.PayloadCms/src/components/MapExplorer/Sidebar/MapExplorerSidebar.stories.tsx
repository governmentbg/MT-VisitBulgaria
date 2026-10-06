import type { Meta, StoryObj } from '@storybook/react'
import { MapExplorerSidebar } from './MapExplorerSidebar'
import { TypeFilterChips } from './TypeFilterChips'
import { ResultsList } from './ResultsList'
import type { MapExplorerPOI } from '../types'

const meta = {
  title: 'MapExplorer/MapExplorerSidebar',
  component: MapExplorerSidebar,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', padding: 16, background: '#f1f5f9' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MapExplorerSidebar>

export default meta
type Story = StoryObj<typeof meta>

const typeFacets = [
  { value: 'museum', count: 1 },
  { value: 'nature', count: 1 },
  { value: 'food', count: 1 },
]

const typeLabels: Record<string, string> = {
  museum: 'Museums',
  nature: 'Nature',
  food: 'Food & Drink',
}

const samplePois: MapExplorerPOI[] = [
  {
    id: 'poi-1',
    title: 'National History Museum',
    slug: 'national-history-museum',
    type: 'museum',
    categories: ['Museums'],
    location: { lat: 42.6977, lng: 23.3219 },
    city: 'Sofia',
    heroImageUrl: 'https://placehold.co/400x300',
  },
  {
    id: 'poi-2',
    title: 'Vitosha Mountain',
    slug: 'vitosha-mountain',
    type: 'nature',
    categories: ['Nature'],
    location: { lat: 42.5634, lng: 23.2785 },
    city: 'Sofia',
    heroImageUrl: 'https://placehold.co/400x300',
  },
  {
    id: 'poi-3',
    title: 'Alexander Nevsky Cathedral',
    slug: 'alexander-nevsky',
    type: 'landmark',
    categories: ['Landmarks'],
    location: { lat: 42.6959, lng: 23.3327 },
    city: 'Sofia',
    heroImageUrl: 'https://placehold.co/400x300',
  },
]

export const FullComposition: Story = {
  args: {
    title: 'Explore',
    headerAction: undefined,
    children: null,
  },
  render: (args) => (
    <MapExplorerSidebar title={args.title} headerAction={args.headerAction}>
      <TypeFilterChips
        facets={typeFacets}
        activeTypes={[]}
        allLabel="All"
        typeLabels={typeLabels}
        onTypeChange={() => {}}
      />
      <ResultsList
        pois={samplePois}
        selectedSlug={null}
        totalFound={3}
        resultsLabel="Results"
        typeLabels={typeLabels}
        onSelectPOI={() => {}}
      />
    </MapExplorerSidebar>
  ),
}

export const WithSelectedResult: Story = {
  args: {
    title: 'Explore',
    headerAction: undefined,
    children: null,
  },
  render: (args) => (
    <MapExplorerSidebar title={args.title} headerAction={args.headerAction}>
      <TypeFilterChips
        facets={typeFacets}
        activeTypes={['museum']}
        allLabel="All"
        typeLabels={typeLabels}
        onTypeChange={() => {}}
      />
      <ResultsList
        pois={samplePois}
        selectedSlug="national-history-museum"
        totalFound={3}
        resultsLabel="Results"
        typeLabels={typeLabels}
        onSelectPOI={() => {}}
      />
    </MapExplorerSidebar>
  ),
}

export const EmptyState: Story = {
  args: {
    title: 'Explore',
    children: null,
  },
  render: (args) => (
    <MapExplorerSidebar title={args.title}>
      <TypeFilterChips
        facets={typeFacets}
        activeTypes={[]}
        allLabel="All"
        typeLabels={typeLabels}
        onTypeChange={() => {}}
      />
      <ResultsList
        pois={[]}
        selectedSlug={null}
        totalFound={0}
        resultsLabel="Results"
        typeLabels={typeLabels}
        onSelectPOI={() => {}}
      />
    </MapExplorerSidebar>
  ),
}
