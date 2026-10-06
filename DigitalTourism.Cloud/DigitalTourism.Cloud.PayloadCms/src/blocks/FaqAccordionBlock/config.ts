import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FaqAccordionBlock: Block = {
  slug: 'faqAccordion',
  interfaceName: 'FaqAccordionBlock',
  labels: {
    singular: 'FAQ Accordion',
    plural: 'FAQ Accordions',
  },
  imageURL: blockImageUrls.faqAccordion,
  imageAltText: 'FAQ accordion',
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
      name: 'description',
      type: 'text',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          localized: true,
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
    {
      name: 'allowMultipleOpen',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When enabled, the FAQ accordion spans the full page width instead of being contained.',
      },
    },
  ],
}
