import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { curatorOrAdmin, hiddenFromNonCurator } from '../../access/accessHelpers'
import { CallToAction } from '../../blocks/CallToAction/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { ExperienceListingBlock } from '../../plugins/experience-listing/blocks/ExperienceListing/config'
import { IconCardsBlock } from '../../blocks/IconCardsBlock/config'
import { StatisticsBannerBlock } from '../../blocks/StatisticsBannerBlock/config'
import { FullWidthCtaBlock } from '../../blocks/FullWidthCtaBlock/config'
import { FaqAccordionBlock } from '../../blocks/FaqAccordionBlock/config'
import { PagesBlock } from '../../blocks/PagesBlock/config'
import { FeatureSectionBlock } from '../../blocks/FeatureSectionBlock/config'
import { GalleryBlock } from '../../blocks/GalleryBlock/config'
import { FactsListingBlock } from '../../blocks/FactsListingBlock/config'
import { SpacerBlock } from '../../blocks/SpacerBlock/config'
import { StatsBlock } from '../../blocks/StatsBlock/config'
import { ColumnsBlock } from '../../blocks/ColumnsBlock/config'
import { SvgMapBlock } from '../../blocks/SvgMapBlock/config'
import { FeatureHighlightBlock } from '../../blocks/FeatureHighlightBlock/config'
import { MapExplorerBlock } from '../../blocks/MapExplorerBlock/config'
import { ArchiveBlock } from '../../blocks/ArchiveBlock/config'
import {
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HorizontalRuleFeature,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { withExpandedBlocks } from '../../features/expandedBlocks/withExpandedBlocks'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/SlugField'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { requireEnglishBeforePublish } from './hooks/requireEnglishBeforePublish'
import type { Page } from '@/payload-types'
import { collectionLabels, commonLabels, tabLabels, pageLabels, adminGroupLabels } from '@/i18n/admin'
import { localizedRequiredText, localizedRequiredRichText } from '@/utilities/localizedRequired'

// Helper to get full path from breadcrumbs
const getPagePath = (data: Partial<Page>): string => {
  if (data?.slug === 'home') return '/'

  if (data?.breadcrumbs && Array.isArray(data.breadcrumbs) && data.breadcrumbs.length > 0) {
    const lastBreadcrumb = data.breadcrumbs[data.breadcrumbs.length - 1]
    if (lastBreadcrumb?.url) {
      return lastBreadcrumb.url
    }
  }

  return `/${data?.slug || ''}`
}

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: collectionLabels.pages,
  access: {
    create: curatorOrAdmin,
    delete: curatorOrAdmin,
    read: authenticatedOrPublished,
    update: curatorOrAdmin,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
    breadcrumbs: true,
  },
  admin: {
    group: adminGroupLabels.content,
    hidden: hiddenFromNonCurator,
    defaultColumns: ['title', 'slug', 'parent', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          path: getPagePath(data as Partial<Page>),
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        path: getPagePath(data as Partial<Page>),
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: commonLabels.title,
      required: true,
      localized: true,
      validate: localizedRequiredText,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: tabLabels.hero,
        },
        {
          fields: [
            {
              name: 'content',
              type: 'richText',
              localized: true,
              admin: {
                components: {
                  Diff: '@/components/admin/LexicalBlockDiff#LexicalBlockDiffComponent',
                },
              },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  BlocksFeature({
                    blocks: [
                      ...withExpandedBlocks(
                        [
                          CallToAction, MediaBlock,
                          ExperienceListingBlock,
                          IconCardsBlock, StatisticsBannerBlock, FullWidthCtaBlock,
                          FaqAccordionBlock, PagesBlock, FeatureSectionBlock,
                          GalleryBlock,
                          FactsListingBlock,
                          SpacerBlock,
                          StatsBlock,
                          SvgMapBlock,
                          FeatureHighlightBlock,
                          MapExplorerBlock,
                        ],
                        {
                          cta: '@/blocks/CallToAction/admin/CallToActionPreview#CallToActionPreview',
                          mediaBlock: '@/blocks/MediaBlock/admin/MediaBlockPreview#MediaBlockPreview',
                          experienceListing: '@/plugins/experience-listing/admin/ExperienceListingPreview#ExperienceListingPreview',
                          iconCards: '@/blocks/IconCardsBlock/admin/IconCardsPreview#IconCardsPreview',
                          statisticsBanner: '@/blocks/StatisticsBannerBlock/admin/StatisticsBannerPreview#StatisticsBannerPreview',
                          fullWidthCta: '@/blocks/FullWidthCtaBlock/admin/FullWidthCtaPreview#FullWidthCtaPreview',
                          faqAccordion: '@/blocks/FaqAccordionBlock/admin/FaqAccordionPreview#FaqAccordionPreview',
                          pagesBlock: '@/blocks/PagesBlock/admin/PagesBlockPreview#PagesBlockPreview',
                          featureSection: '@/blocks/FeatureSectionBlock/admin/FeatureSectionPreview#FeatureSectionPreview',
                          masonryGallery: '@/blocks/GalleryBlock/admin/GalleryPreview#GalleryPreview',
                          factsListing: '@/blocks/FactsListingBlock/admin/FactsListingPreview#FactsListingPreview',
                          spacerBlock: '@/blocks/SpacerBlock/admin/SpacerPreview#SpacerPreview',
                          stats: '@/blocks/StatsBlock/admin/StatsPreview#StatsPreview',
                          svgMap: '@/blocks/SvgMapBlock/admin/SvgMapPreview#SvgMapPreview',
                          featureHighlight: '@/blocks/FeatureHighlightBlock/admin/FeatureHighlightPreview#FeatureHighlightPreview',
                          mapExplorer: '@/blocks/MapExplorerBlock/admin/MapExplorerPreview#MapExplorerPreview',
                        },
                      ),
                      ArchiveBlock, // Dummy block for stale DB data
                      ColumnsBlock, // Has its own inline admin component
                    ],
                  }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              required: true,
              validate: localizedRequiredRichText,
            },
          ],
          label: tabLabels.content,
        },
        {
          name: 'meta',
          label: pageLabels.seo,
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: commonLabels.publishedAt,
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
    {
      name: 'breadcrumbs',
      type: 'array',
      localized: true,
      admin: {
        readOnly: true,
        hidden: true,
      },
      fields: [
        {
          name: 'doc',
          type: 'relationship',
          admin: { disabled: true },
          maxDepth: 0,
          relationTo: 'pages',
        },
        {
          type: 'row',
          fields: [
            { name: 'url', type: 'text', admin: { width: '50%' }, label: 'URL' },
            { name: 'label', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeValidate: [requireEnglishBeforePublish],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 5000, // We set this interval for optimal live preview
        showSaveDraftButton: true,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
