import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'

export const FeaturedEventsBlock: Block = {
  slug: 'featuredEvents',
  interfaceName: 'FeaturedEventsBlock',
  labels: {
    singular: 'Featured Events',
    plural: 'Featured Events',
  },
  imageURL: blockImageUrls.featuredEvents,
  imageAltText: 'Featured events',
  admin: {
    group: blockGroupLabels.dataListings,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'populateAutomatically',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Automatically select upcoming events instead of manual picks.',
      },
    },
    {
      name: 'featuredEvent',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        condition: (_, siblingData) => !siblingData?.populateAutomatically,
        description: 'Select the main featured event (displayed large on the left).',
      },
    },
    {
      name: 'sideEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      maxRows: 4,
      admin: {
        condition: (_, siblingData) => !siblingData?.populateAutomatically,
        description: 'Select 2-4 events to display on the right side.',
      },
    },
    {
      name: 'sideEventCount',
      type: 'number',
      defaultValue: 3,
      min: 2,
      max: 4,
      admin: {
        condition: (_, siblingData) => !!siblingData?.populateAutomatically,
        description: 'How many side events to show alongside the featured event.',
      },
    },
  ],
}
