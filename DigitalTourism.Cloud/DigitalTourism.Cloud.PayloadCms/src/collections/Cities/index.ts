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
import { hiddenFromNonCurator } from '../../access/accessHelpers'
import { mediaFilterOptions } from '../../access/mediaAccess'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { preventDeleteWithExperiences } from './hooks/preventDeleteWithExperiences'

import {
  collectionLabels,
  adminGroupLabels,
  commonLabels,
  geographyLabels,
  geographyDescriptions,
} from '@/i18n/admin'

export const Cities: CollectionConfig = {
  slug: 'cities',
  labels: collectionLabels.cities,
  access: {
    create: adminOnly,
    read: () => true, // Public reference data
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    hidden: hiddenFromNonCurator,
    group: adminGroupLabels.taxonomy,
    defaultColumns: ['name', 'municipality', 'population', 'isCapital', 'updatedAt'],
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
        description: geographyDescriptions.cityName,
      },
    },
    {
      name: 'municipality',
      type: 'relationship',
      label: geographyLabels.municipality,
      relationTo: 'municipalities',
      required: true,
      index: true,
      admin: {
        description: geographyDescriptions.parentMunicipality,
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
      name: 'population',
      type: 'number',
      label: geographyLabels.population,
      admin: {
        description: geographyDescriptions.cityPopulation,
      },
    },
    {
      name: 'isCapital',
      type: 'checkbox',
      label: geographyLabels.isCapital,
      defaultValue: false,
      admin: {
        description: geographyDescriptions.isCapital,
      },
    },
    {
      name: 'coordinates',
      type: 'group',
      label: geographyLabels.coordinates,
      admin: {
        description: geographyDescriptions.coordinates,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              label: geographyLabels.latitude,
              min: -90,
              max: 90,
              admin: {
                description: geographyDescriptions.latitudeRange,
              },
            },
            {
              name: 'longitude',
              type: 'number',
              label: geographyLabels.longitude,
              min: -180,
              max: 180,
              admin: {
                description: geographyDescriptions.longitudeRange,
              },
            },
          ],
        },
        {
          name: 'mapPicker',
          type: 'ui',
          admin: {
            components: {
              Field: '@/components/admin/MapPicker',
            },
          },
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: commonLabels.heroImage,
      relationTo: 'media',
      filterOptions: mediaFilterOptions,
      admin: {
        description: geographyDescriptions.heroImageCity,
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
        description: geographyDescriptions.richDescriptionCity,
      },
    },
  ],
  hooks: {
    beforeDelete: [preventDeleteWithExperiences],
  },
  timestamps: true,
}
