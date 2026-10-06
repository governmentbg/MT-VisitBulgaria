import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { iconField } from '@/fields/icon'
import { blockGroupLabels, statsBlockLabels, statsBlockDescriptions } from '@/i18n/admin'

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: statsBlockLabels.singular,
    plural: statsBlockLabels.plural,
  },
  imageURL: blockImageUrls.stats,
  imageAltText: 'Stats block',
  admin: {
    group: blockGroupLabels.dataListings,
  },
  fields: [
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'panel',
      label: statsBlockLabels.displayMode,
      options: [
        { label: statsBlockLabels.modePanel, value: 'panel' },
        { label: statsBlockLabels.modeGrid, value: 'grid' },
        { label: statsBlockLabels.modeCounters, value: 'counters' },
        { label: statsBlockLabels.modeInline, value: 'inline' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      label: statsBlockLabels.heading,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: statsBlockLabels.image,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'panel',
        description: statsBlockDescriptions.image,
      },
    },
    {
      name: 'cardColor',
      type: 'select',
      defaultValue: 'primary-800',
      label: statsBlockLabels.cardColor,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.displayMode === 'panel' || siblingData?.displayMode === 'grid',
      },
      options: [
        { label: 'Primary Dark', value: 'primary-800' },
        { label: 'Primary Darker', value: 'primary-900' },
        { label: 'Dark', value: 'grey-900' },
        { label: 'Light', value: 'grey-50' },
        { label: 'Transparent', value: 'transparent' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      label: statsBlockLabels.columns,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'grid',
      },
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      label: statsBlockLabels.items,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          localized: true,
          required: true,
          label: statsBlockLabels.value,
          admin: {
            description: statsBlockDescriptions.value,
          },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
          label: statsBlockLabels.label,
          admin: {
            description: statsBlockDescriptions.label,
          },
        },
        iconField({
          label: statsBlockLabels.icon,
          admin: {
            description: statsBlockDescriptions.icon,
          },
        }),
      ],
    },
  ],
}
