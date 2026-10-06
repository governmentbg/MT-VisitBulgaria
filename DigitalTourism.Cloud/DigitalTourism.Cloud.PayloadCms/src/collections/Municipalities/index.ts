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
import { preventDeleteWithCities } from './hooks/preventDeleteWithCities'

import {
  collectionLabels,
  adminGroupLabels,
  commonLabels,
  geographyLabels,
  geographyDescriptions,
} from '@/i18n/admin'

export const Municipalities: CollectionConfig = {
  slug: 'municipalities',
  labels: collectionLabels.municipalities,
  access: {
    create: adminOnly,
    read: () => true, // Public reference data
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    hidden: hiddenFromNonAdmin,
    group: adminGroupLabels.taxonomy,
    defaultColumns: ['name', 'region', 'code', 'ekatteCode', 'updatedAt'],
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
        description: geographyDescriptions.municipalityName,
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
        placeholder: 'VAR01',
      },
    },
    {
      name: 'region',
      type: 'relationship',
      label: geographyLabels.region,
      relationTo: 'regions',
      required: true,
      index: true,
      admin: {
        description: geographyDescriptions.parentRegion,
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
        description: geographyDescriptions.heroImageMunicipality,
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
        description: geographyDescriptions.richDescriptionMunicipality,
      },
    },
  ],
  hooks: {
    beforeDelete: [preventDeleteWithCities],
  },
  timestamps: true,
}
