import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'
import { iconField } from '@/fields/icon'

export const StatisticsBannerBlock: Block = {
  slug: 'statisticsBanner',
  interfaceName: 'StatisticsBannerBlock',
  labels: {
    singular: 'Statistics Banner',
    plural: 'Statistics Banners',
  },
  imageURL: blockImageUrls.statisticsBanner,
  imageAltText: 'Statistics banner',
  admin: {
    group: blockGroupLabels.dataListings,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          localized: true,
          required: true,
          admin: {
            description: 'The statistic number, e.g. "60,000+"',
          },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
          admin: {
            description: 'Description label, e.g. "места за настаняване"',
          },
        },
        iconField({ admin: { description: 'Optional icon displayed above the number.' } }),
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark (Primary 900)', value: 'dark' },
        { label: 'Primary', value: 'primary' },
        { label: 'Primary Dark (800)', value: 'primary-dark' },
        { label: 'Light', value: 'light' },
      ],
    },
  ],
}
