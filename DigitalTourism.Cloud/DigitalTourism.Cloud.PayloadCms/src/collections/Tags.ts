import type { CollectionConfig } from 'payload'

import { mediaFilterOptions } from '../access/mediaAccess'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { curatorOrAdmin, hiddenFromNonCurator } from '../access/accessHelpers'
import { Banner } from '../blocks/Banner/config'
import { Code } from '../blocks/Code/config'
import { MediaBlock } from '../blocks/MediaBlock/config'
import { slugField } from '@/fields/SlugField'
import { collectionLabels, commonLabels, adminGroupLabels } from '@/i18n/admin'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: collectionLabels.tags,
  access: {
    create: curatorOrAdmin,
    delete: curatorOrAdmin,
    read: anyone,
    update: curatorOrAdmin,
  },
  admin: {
    group: adminGroupLabels.taxonomy,
    hidden: hiddenFromNonCurator,
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: commonLabels.title,
      required: true,
      localized: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      label: commonLabels.heroImage,
      relationTo: 'media',
      filterOptions: mediaFilterOptions,
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
    },
    slugField({
      position: undefined,
    }),
  ],
}
