import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'

export const FeatureHighlightBlock: Block = {
  slug: 'featureHighlight',
  interfaceName: 'FeatureHighlightBlock',
  labels: {
    singular: 'Feature Highlight',
    plural: 'Feature Highlights',
  },
  imageURL: blockImageUrls.featureHighlight,
  imageAltText: 'Feature highlight',
  admin: {
    group: blockGroupLabels.content,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'showBackground',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show teal background shape behind the section.',
      },
    },
    {
      name: 'showDecoration',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show decorative map SVG in the background.',
      },
    },
  ],
}
