import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'

export const LearnMoreBlock: Block = {
  slug: 'learnMore',
  interfaceName: 'LearnMoreBlock',
  labels: {
    singular: 'Learn More',
    plural: 'Learn More Blocks',
  },
  imageURL: blockImageUrls.learnMore,
  imageAltText: 'Learn more block',
  admin: {
    group: blockGroupLabels.content,
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
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'body',
          type: 'richText',
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
