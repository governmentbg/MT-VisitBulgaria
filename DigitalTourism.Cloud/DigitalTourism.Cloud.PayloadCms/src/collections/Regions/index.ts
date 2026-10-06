import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { adminOnly } from '../../access/adminOnly'
import { hiddenFromNonAdmin } from '../../access/accessHelpers'
import { mediaFilterOptions } from '../../access/mediaAccess'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'

import {
  collectionLabels,
  adminGroupLabels,
  commonLabels,
  geographyLabels,
  geographyDescriptions,
} from '@/i18n/admin'

export const Regions: CollectionConfig = {
  slug: 'regions',
  labels: collectionLabels.regions,
  access: {
    create: adminOnly,
    read: () => true, // Public reference data
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    hidden: hiddenFromNonAdmin,
    group: adminGroupLabels.taxonomy,
    defaultColumns: ['name', 'code', 'ekatteCode', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: geographyLabels.name,
      required: true,
      localized: true,
      admin: {
        description: geographyDescriptions.regionName,
      },
    },
    {
      name: 'code',
      type: 'text',
      label: geographyLabels.code,
      required: true,
      unique: true,
      index: true,
      admin: {
        description: geographyDescriptions.code,
        placeholder: 'VAR',
      },
    },
    {
      name: 'ekatteCode',
      type: 'text',
      label: geographyLabels.ekatteCode,
      index: true,
      admin: {
        description: geographyDescriptions.ekatteCode,
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: commonLabels.heroImage,
      relationTo: 'media',
      filterOptions: mediaFilterOptions,
      admin: {
        description: geographyDescriptions.heroImage,
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: commonLabels.description,
      localized: true,
      admin: {
        description: geographyDescriptions.richDescription,
      },
    },
  ],
  timestamps: true,
}
