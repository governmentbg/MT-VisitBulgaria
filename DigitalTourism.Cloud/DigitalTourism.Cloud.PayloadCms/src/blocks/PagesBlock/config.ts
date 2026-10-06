import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PagesBlock: Block = {
  slug: 'pagesBlock',
  interfaceName: 'PagesBlock',
  labels: {
    singular: 'Pages Block',
    plural: 'Pages Blocks',
  },
  imageURL: blockImageUrls.pagesBlock,
  imageAltText: 'Pages block',
  admin: {
    group: blockGroupLabels.dataListings,
  },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'carousel',
      options: [
        { label: 'Carousel', value: 'carousel' },
        { label: 'Masonry Grid', value: 'masonry' },
        { label: 'Organizer', value: 'organizer' },
      ],
    },
    {
      name: 'populateFrom',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Selection', value: 'manual' },
        { label: 'Child Pages', value: 'children' },
      ],
      admin: {
        description: 'Choose "Child Pages" to automatically display children of the current page.',
      },
    },
    {
      name: 'parentPage',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_, siblingData) => siblingData?.populateFrom === 'children',
        description: 'Select a parent page to display its children. Leave empty to use the current page.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 8,
      min: 1,
      max: 8,
      admin: {
        condition: (_, siblingData) => siblingData?.populateFrom === 'children',
        description: 'Maximum number of child pages to display.',
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
        condition: (_, siblingData) => siblingData?.populateFrom !== 'children',
      },
      fields: [
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: {
            description: 'Pill text on card. Falls back to page title if empty.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional override for page hero image.',
          },
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: {
            description: 'Optional override for page title.',
          },
        },
      ],
    },
    // Organizer mode fields
    {
      name: 'organizerHeading',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'organizer',
        description: 'Heading for the organizer section (e.g. organizer name).',
      },
    },
    {
      name: 'organizerDescription',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'organizer',
        description: 'Description text for the organizer section.',
      },
    },
    {
      name: 'organizerCtaLabel',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'organizer',
        description: 'CTA button text (e.g. "Learn More").',
      },
    },
    {
      name: 'organizerCtaUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'organizer',
        description: 'CTA button link URL.',
      },
    },
  ],
}
