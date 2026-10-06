import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'
import { EXPERIENCE_SLUGS } from '@/collections/Experiences/constants'

export const MapExplorerBlock: Block = {
  slug: 'mapExplorer',
  interfaceName: 'MapExplorerBlock',
  labels: {
    singular: 'Map Explorer',
    plural: 'Map Explorer',
  },
  imageURL: blockImageUrls.mapExplorer,
  imageAltText: 'Map explorer',
  admin: {
    group: blockGroupLabels.mapsLocation,
  },
  fields: [
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'nearby',
      required: true,
      options: [
        { label: 'Nearby Experiences', value: 'nearby' },
        { label: 'Region Map', value: 'region' },
      ],
      admin: {
        description: 'Choose the map display mode.',
      },
    },

    // ── Nearby mode ─────────────────────────────────────────────────────
    {
      name: 'nearbyExperience',
      type: 'relationship',
      relationTo: [...EXPERIENCE_SLUGS],
      admin: {
        description: 'Select the experience to center the map on.',
        condition: (_, siblingData) => siblingData?.mode === 'nearby',
      },
    },
    {
      name: 'nearbyStrategy',
      type: 'select',
      defaultValue: 'radius',
      options: [
        { label: 'Within radius', value: 'radius' },
        { label: 'Closest count', value: 'count' },
      ],
      admin: {
        description: 'How to select nearby experiences.',
        condition: (_, siblingData) => siblingData?.mode === 'nearby',
      },
    },
    {
      name: 'nearbyRadius',
      type: 'number',
      defaultValue: 10,
      min: 1,
      max: 100,
      admin: {
        description: 'Search radius in kilometers.',
        condition: (_, siblingData) =>
          siblingData?.mode === 'nearby' && siblingData?.nearbyStrategy === 'radius',
      },
    },
    {
      name: 'nearbyCount',
      type: 'select',
      defaultValue: '10',
      options: [
        { label: '10 closest', value: '10' },
        { label: '20 closest', value: '20' },
        { label: '50 closest', value: '50' },
      ],
      admin: {
        description: 'Number of closest experiences to show.',
        condition: (_, siblingData) =>
          siblingData?.mode === 'nearby' && siblingData?.nearbyStrategy === 'count',
      },
    },

    // ── Region mode ─────────────────────────────────────────────────────
    {
      name: 'regionScope',
      type: 'select',
      defaultValue: 'city',
      options: [
        { label: 'Region', value: 'region' },
        { label: 'Municipality', value: 'municipality' },
        { label: 'City', value: 'city' },
      ],
      admin: {
        description: 'Geographic scope for the region map.',
        condition: (_, siblingData) => siblingData?.mode === 'region',
      },
    },
    {
      name: 'regionRelation',
      type: 'relationship',
      relationTo: 'regions',
      admin: {
        description: 'Select the region to display.',
        condition: (_, siblingData) =>
          siblingData?.mode === 'region' && siblingData?.regionScope === 'region',
      },
    },
    {
      name: 'municipalityRelation',
      type: 'relationship',
      relationTo: 'municipalities',
      admin: {
        description: 'Select the municipality to display.',
        condition: (_, siblingData) =>
          siblingData?.mode === 'region' && siblingData?.regionScope === 'municipality',
      },
    },
    {
      name: 'cityRelation',
      type: 'relationship',
      relationTo: 'cities',
      admin: {
        description: 'Select the city to display.',
        condition: (_, siblingData) =>
          siblingData?.mode === 'region' && siblingData?.regionScope === 'city',
      },
    },

    // ── Shared (nearby + region) ────────────────────────────────────────
    {
      name: 'mapHeight',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small (30vh)', value: 'sm' },
        { label: 'Medium (45vh)', value: 'md' },
        { label: 'Large (60vh)', value: 'lg' },
      ],
      admin: {
        description: 'Height of the map container.',
        condition: (_, siblingData) =>
          siblingData?.mode === 'nearby' || siblingData?.mode === 'region',
      },
    },
  ],
}
