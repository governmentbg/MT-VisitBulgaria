import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { withMediaOwnerFilter } from '@/access/mediaAccess'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'navTheme',
      type: 'select',
      defaultValue: 'transparent-light',
      label: 'Header Theme',
      admin: {
        description: 'Controls the header appearance when this hero is displayed',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      options: [
        { label: 'Transparent Light (white text)', value: 'transparent-light' },
        { label: 'Transparent Dark (dark text)', value: 'transparent-dark' },
        { label: 'Solid', value: 'solid' },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'decorativeText',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional decorative text displayed vertically on the hero (desktop only)',
        condition: (_, { type } = {}) => type === 'mediumImpact',
      },
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
      filterOptions: withMediaOwnerFilter({
        or: [
          { mimeType: { contains: 'image' } },
          { mimeType: { contains: 'video' } },
        ],
      }),
    },
  ],
  label: false,
}
