import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'
import { link } from '@/fields/link'
import { iconField } from '@/fields/icon'

export const IconCardsBlock: Block = {
  slug: 'iconCards',
  interfaceName: 'IconCardsBlock',
  labels: {
    singular: 'Icon Cards',
    plural: 'Icon Cards',
  },
  imageURL: blockImageUrls.iconCards,
  imageAltText: 'Icon cards',
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
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      fields: [
        iconField(),
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional circular thumbnail image (used instead of icon).',
          },
        },
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
        link({
          appearances: false,
        }),
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
  ],
}
