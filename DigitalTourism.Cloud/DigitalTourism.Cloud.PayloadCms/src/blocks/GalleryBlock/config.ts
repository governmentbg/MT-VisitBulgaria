import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'

export const GalleryBlock: Block = {
  slug: 'masonryGallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  imageURL: blockImageUrls.masonryGallery,
  imageAltText: 'Gallery block',
  admin: {
    group: blockGroupLabels.content,
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'masonry',
      options: [
        { label: 'Masonry', value: 'masonry' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
    },
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
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 3,
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layout !== 'horizontal',
      },
    },
    {
      name: 'maxImages',
      type: 'number',
      defaultValue: 12,
      min: 3,
      max: 24,
    },
  ],
}
