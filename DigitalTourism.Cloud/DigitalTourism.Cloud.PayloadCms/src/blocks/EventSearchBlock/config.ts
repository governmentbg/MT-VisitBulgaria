import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'

export const EventSearchBlock: Block = {
  slug: 'eventSearch',
  interfaceName: 'EventSearchBlock',
  labels: {
    singular: 'Event Search',
    plural: 'Event Search',
  },
  imageURL: blockImageUrls.eventSearch,
  imageAltText: 'Event search',
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
      name: 'whatPlaceholder',
      type: 'text',
      localized: true,
      defaultValue: 'Какво',
    },
    {
      name: 'wherePlaceholder',
      type: 'text',
      localized: true,
      defaultValue: 'Къде',
    },
    {
      name: 'whenPlaceholder',
      type: 'text',
      localized: true,
      defaultValue: 'Кога',
    },
    {
      name: 'searchButtonLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Търси',
    },
    {
      name: 'searchResultsPage',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        description: 'Page to redirect to with search query params.',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'teal',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Teal', value: 'teal' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}
