'use client'

import { useRowLabel } from '@payloadcms/ui'

const FACET_LABELS: Record<string, string> = {
  type: 'Experience Type',
  categories: 'Categories',
  tags: 'Tags',
  region: 'Region',
  municipality: 'Municipality',
  city: 'City',
  starRating: 'Star Rating',
  amenities: 'Amenities',
  cuisineType: 'Cuisine Type',
  dietaryOptions: 'Dietary Options',
  difficultyLevel: 'Difficulty Level',
  seasonality: 'Seasonality',
  organizer: 'Organizer',
}

const FacetRowLabel = () => {
  const { data } = useRowLabel<{ facetKey?: string; enabled?: boolean }>()
  const label = data?.facetKey ? FACET_LABELS[data.facetKey] || data.facetKey : 'New Facet'
  const status = data?.enabled === false ? ' (disabled)' : ''
  return <span>{label}{status}</span>
}

export default FacetRowLabel
