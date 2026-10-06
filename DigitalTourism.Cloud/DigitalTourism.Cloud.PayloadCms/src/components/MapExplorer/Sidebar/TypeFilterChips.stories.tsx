import type { Meta, StoryObj } from '@storybook/react'
import { TypeFilterChips } from './TypeFilterChips'
import type { FacetValue } from '@/lib/search/types'

const meta = {
  title: 'MapExplorer/TypeFilterChips',
  component: TypeFilterChips,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TypeFilterChips>

export default meta
type Story = StoryObj<typeof meta>

const sampleFacets: FacetValue[] = [
  { value: 'museum', count: 12 },
  { value: 'nature', count: 8 },
  { value: 'food', count: 15 },
  { value: 'landmark', count: 6 },
  { value: 'nightlife', count: 4 },
]

const typeLabels: Record<string, string> = {
  museum: 'Museums',
  nature: 'Nature',
  food: 'Food & Drink',
  landmark: 'Landmarks',
  nightlife: 'Nightlife',
}

export const AllActive: Story = {
  args: {
    facets: sampleFacets,
    activeTypes: [],
    allLabel: 'All',
    typeLabels,
    onTypeChange: () => {},
  },
}

export const TypeSelected: Story = {
  args: {
    facets: sampleFacets,
    activeTypes: ['nature'],
    allLabel: 'All',
    typeLabels,
    onTypeChange: () => {},
  },
}

export const MultipleTypesSelected: Story = {
  args: {
    facets: sampleFacets,
    activeTypes: ['museum', 'landmark'],
    allLabel: 'All',
    typeLabels,
    onTypeChange: () => {},
  },
}

export const FewTypes: Story = {
  args: {
    facets: sampleFacets.slice(0, 2),
    activeTypes: ['museum'],
    allLabel: 'All',
    typeLabels,
    onTypeChange: () => {},
  },
}
