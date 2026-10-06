import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'
import { iconField } from '@/fields/icon'
import { link } from '@/fields/link'

export const FactsListingBlock: Block = {
  slug: 'factsListing',
  interfaceName: 'FactsListingBlock',
  labels: {
    singular: 'Facts Listing',
    plural: 'Facts Listings',
  },
  imageURL: blockImageUrls.factsListing,
  imageAltText: 'Facts listing',
  admin: {
    group: blockGroupLabels.dataListings,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'showWeather',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'weatherCity',
      type: 'relationship',
      relationTo: 'cities',
      admin: {
        condition: (_, siblingData) => siblingData?.showWeather === true,
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      fields: [
        iconField(),
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
        },
        link({ appearances: false }),
      ],
    },
  ],
}
