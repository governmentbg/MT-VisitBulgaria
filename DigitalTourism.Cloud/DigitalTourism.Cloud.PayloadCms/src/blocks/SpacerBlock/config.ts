import type { Block } from 'payload'
import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { spacerBlockLabels, spacerBlockDescriptions, blockGroupLabels } from '@/i18n/admin'

export const SpacerBlock: Block = {
  slug: 'spacerBlock',
  interfaceName: 'SpacerBlock',
  labels: {
    singular: spacerBlockLabels.singular,
    plural: spacerBlockLabels.plural,
  },
  imageURL: blockImageUrls.spacerBlock,
  imageAltText: 'Spacer block',
  admin: {
    group: blockGroupLabels.layout,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: spacerBlockLabels.image,
    },
    {
      name: 'alt',
      type: 'text',
      localized: true,
      label: spacerBlockLabels.alt,
      admin: {
        description: spacerBlockDescriptions.alt,
      },
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: '60vh',
      label: spacerBlockLabels.height,
      options: [
        { label: '40vh', value: '40vh' },
        { label: '50vh', value: '50vh' },
        { label: '60vh', value: '60vh' },
        { label: '70vh', value: '70vh' },
        { label: '80vh', value: '80vh' },
        { label: '100vh', value: '100vh' },
      ],
    },
    {
      name: 'overlayText',
      type: 'group',
      label: spacerBlockLabels.overlayText,
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
          label: spacerBlockLabels.overlayTextValue,
        },
        {
          name: 'font',
          type: 'select',
          defaultValue: 'display',
          label: spacerBlockLabels.font,
          options: [
            { label: spacerBlockLabels.fontDisplay, value: 'display' },
            { label: spacerBlockLabels.fontHeading, value: 'heading' },
            { label: spacerBlockLabels.fontSans, value: 'sans' },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'positionX',
              type: 'number',
              min: 0,
              max: 100,
              defaultValue: 50,
              label: spacerBlockLabels.positionX,
              admin: {
                step: 1,
                width: '50%',
              },
            },
            {
              name: 'positionY',
              type: 'number',
              min: 0,
              max: 100,
              defaultValue: 50,
              label: spacerBlockLabels.positionY,
              admin: {
                step: 1,
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'fadeIn',
      type: 'group',
      label: spacerBlockLabels.fadeIn,
      admin: {
        description: spacerBlockDescriptions.fadeIn,
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: spacerBlockLabels.enabled,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'color',
              type: 'text',
              defaultValue: '#ffffff',
              label: spacerBlockLabels.gradientColor,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'height',
              type: 'number',
              min: 0,
              max: 100,
              defaultValue: 40,
              label: spacerBlockLabels.gradientHeight,
              admin: {
                step: 1,
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'fadeOut',
      type: 'group',
      label: spacerBlockLabels.fadeOut,
      admin: {
        description: spacerBlockDescriptions.fadeOut,
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: spacerBlockLabels.enabled,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'color',
              type: 'text',
              defaultValue: '#00675c',
              label: spacerBlockLabels.gradientColor,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'height',
              type: 'number',
              min: 0,
              max: 100,
              defaultValue: 40,
              label: spacerBlockLabels.gradientHeight,
              admin: {
                step: 1,
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'spacing',
      type: 'group',
      label: spacerBlockLabels.spacing,
      admin: {
        description: spacerBlockDescriptions.spacing,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'offsetTop',
              type: 'number',
              min: -200,
              max: 200,
              defaultValue: 0,
              label: spacerBlockLabels.offsetTop,
              admin: {
                step: 1,
                width: '50%',
              },
            },
            {
              name: 'offsetBottom',
              type: 'number',
              min: -200,
              max: 200,
              defaultValue: 0,
              label: spacerBlockLabels.offsetBottom,
              admin: {
                step: 1,
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}
