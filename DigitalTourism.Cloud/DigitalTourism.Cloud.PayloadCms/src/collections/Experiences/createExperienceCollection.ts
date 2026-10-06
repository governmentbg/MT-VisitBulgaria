import type { CollectionConfig, Field } from 'payload'
import type { CollectionLabels } from '@/i18n/admin/types'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { withExpandedBlocks } from '../../features/expandedBlocks/withExpandedBlocks'

import {
  experienceCreateAccess,
  experienceReadAccess,
  experienceUpdateAccess,
  experienceDeleteAccess,
  cityFieldAccess,
} from '../../access/experienceAccess'
import { mediaFilterOptions, withMediaOwnerFilter } from '../../access/mediaAccess'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { LearnMoreBlock } from '../../blocks/LearnMoreBlock/config'

import { slugField } from '@/fields/SlugField'
import {
  adminGroupLabels,
  tabLabels,
  commonLabels,
  commonDescriptions,
  experienceLabels,
  locationLabels,
  contactLabels,
} from '@/i18n/admin'

import { EXPERIENCE_SLUGS, SLUG_TO_PATH } from './constants'
import type { ExperienceSlug } from './constants'

interface ExperienceCollectionConfig {
  slug: ExperienceSlug
  labels: CollectionLabels
  typeSpecificFields: Field[]
}

/**
 * Factory function to create an experience collection.
 * Encapsulates all shared fields, tabs, hooks, access, and versions config.
 */
export function createExperienceCollection({
  slug,
  labels,
  typeSpecificFields,
}: ExperienceCollectionConfig): CollectionConfig {
  const pathSegment = SLUG_TO_PATH[slug]

  return {
    slug,
    labels,
    folders: false,
    defaultSort: '-updatedAt',
    access: {
      create: experienceCreateAccess,
      delete: experienceDeleteAccess,
      read: experienceReadAccess,
      update: experienceUpdateAccess,
    },
    defaultPopulate: {
      title: true,
      slug: true,
      heroImage: true,
      city: true,
      location: { address: true, coordinates: true },
    },
    admin: {
      group: adminGroupLabels.experiences,
      defaultColumns: ['title', 'city', 'updatedAt'],
      livePreview: {
        url: ({ data, req }) => {
          if (!data?.slug) return null

          const path = `/${pathSegment}/${data.slug}`
          const encodedSlug = encodeURIComponent(data.slug)
          const locale = req?.locale || 'en'

          const encodedParams = new URLSearchParams({
            slug: encodedSlug,
            collection: slug,
            path,
            locale,
            previewSecret: process.env.PREVIEW_SECRET || '',
          })

          return `/next/preview?${encodedParams.toString()}`
        },
      },
      preview: (data, { req }) => {
        if (!data?.slug) return null

        const path = `/${pathSegment}/${data.slug as string}`
        const encodedSlug = encodeURIComponent(data.slug as string)
        const locale = req?.locale || 'en'

        const encodedParams = new URLSearchParams({
          slug: encodedSlug,
          collection: slug,
          path,
          locale,
          previewSecret: process.env.PREVIEW_SECRET || '',
        })

        return `/next/preview?${encodedParams.toString()}`
      },
      useAsTitle: 'title',
    },
    fields: [
      // Sidebar fields
      {
        name: 'city',
        type: 'relationship',
        relationTo: 'cities',
        label: locationLabels.city,
        required: true,
        access: {
          read: cityFieldAccess,
          create: cityFieldAccess,
          update: cityFieldAccess,
        },
        filterOptions: ({ user }) => {
          if (!user) return true
          if (user.collection !== 'users') return false

          const userRoles = (user.roles as string[]) || []
          const isAdmin = userRoles.includes('admin')
          const isTourismCurator = userRoles.includes('tourism-curator')
          const isBusinessOwner = userRoles.includes('business-owner')

          if (isAdmin || isTourismCurator || isBusinessOwner) {
            return true
          }

          if (userRoles.includes('municipal-moderator')) {
            const rawMunicipality = user.assignedMunicipality
            if (!rawMunicipality) {
              return false
            }

            const municipalityId =
              typeof rawMunicipality === 'object' ? (rawMunicipality as any).id : rawMunicipality

            return {
              municipality: {
                equals: municipalityId,
              },
            }
          }

          return false
        },
        admin: {
          position: 'sidebar',
          description: {
            en: 'Primary city for this experience',
            bg: 'Основен град за това преживяване',
          },
        },
      },
      {
        name: 'publishedAt',
        type: 'date',
        label: commonLabels.publishedAt,
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
          },
          position: 'sidebar',
        },
        hooks: {
          beforeChange: [
            ({ siblingData, value }) => {
              if (siblingData._status === 'published' && !value) {
                return new Date()
              }
              return value
            },
          ],
        },
      },
      {
        name: 'categories',
        type: 'relationship',
        label: commonLabels.categories,
        relationTo: 'categories',
        hasMany: true,
        admin: {
          position: 'sidebar',
        },
      },
      {
        name: 'tags',
        type: 'relationship',
        label: commonLabels.tags,
        relationTo: 'tags',
        hasMany: true,
        admin: {
          position: 'sidebar',
        },
      },
      {
        name: 'relatedExperiences',
        type: 'relationship',
        label: experienceLabels.relatedExperiences,
        relationTo: [...EXPERIENCE_SLUGS],
        hasMany: true,
        admin: {
          position: 'sidebar',
        },
      },
      // External source tracking (hidden, used for imports)
      {
        name: 'externalId',
        type: 'text',
        index: true,
        admin: {
          hidden: true,
        },
      },
      {
        name: 'externalSource',
        type: 'text',
        index: true,
        admin: {
          hidden: true,
        },
      },
      slugField(),
      // Main title field (required for useAsTitle)
      {
        name: 'title',
        type: 'text',
        label: commonLabels.title,
        required: true,
        localized: true,
      },
      // Tabs structure
      {
        type: 'tabs',
        tabs: [
          // Tab 1: Content (presentation & media)
          {
            label: tabLabels.content,
            fields: [
              {
                name: 'heroImage',
                type: 'upload',
                label: commonLabels.heroImage,
                relationTo: 'media',
                required: true,
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
                      BlocksFeature({
                        blocks: withExpandedBlocks([Banner, Code, MediaBlock, LearnMoreBlock], {
                          banner: '@/blocks/Banner/admin/BannerPreview#BannerPreview',
                          mediaBlock: '@/blocks/MediaBlock/admin/MediaBlockPreview#MediaBlockPreview',
                          learnMore: '@/blocks/LearnMoreBlock/admin/LearnMorePreview#LearnMorePreview',
                        }),
                      }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                      HorizontalRuleFeature(),
                    ]
                  },
                }),
                label: commonLabels.description,
                required: true,
                localized: true,
              },
              {
                name: 'gallery',
                type: 'upload',
                relationTo: 'media',
                hasMany: true,
                filterOptions: withMediaOwnerFilter({
                  mimeType: { contains: 'image' },
                }),
                label: experienceLabels.gallery,
                admin: {
                  description: commonDescriptions.gallery,
                },
              },
              {
                name: 'videos',
                type: 'array',
                label: experienceLabels.videos,
                admin: {
                  initCollapsed: true,
                  components: {
                    RowLabel: '@/collections/Experiences/RowLabels#VideoRowLabel',
                  },
                },
                fields: [
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'title',
                        type: 'text',
                        label: experienceLabels.videoTitle,
                        localized: true,
                      },
                      {
                        name: 'url',
                        type: 'text',
                        label: experienceLabels.videoUrl,
                        required: true,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'brochures',
                type: 'array',
                label: experienceLabels.brochures,
                admin: {
                  initCollapsed: true,
                  components: {
                    RowLabel: '@/collections/Experiences/RowLabels#BrochureRowLabel',
                  },
                },
                fields: [
                  {
                    type: 'row',
                    fields: [
                      {
                        name: 'file',
                        type: 'upload',
                        label: experienceLabels.brochureFile,
                        relationTo: 'media',
                        required: true,
                        filterOptions: mediaFilterOptions,
                        admin: {
                          width: '30%',
                        },
                      },
                      {
                        name: 'title',
                        type: 'text',
                        label: experienceLabels.brochureTitle,
                        localized: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // Tab 2: Visitor Information (practical details)
          {
            label: tabLabels.visitorInfo,
            fields: [
              {
                name: 'workingHours',
                type: 'richText',
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ]
                  },
                }),
                label: experienceLabels.workingHours,
                localized: true,
              },
              {
                name: 'howToGetThere',
                type: 'richText',
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ]
                  },
                }),
                label: experienceLabels.howToGetThere,
                localized: true,
              },
              {
                name: 'practicalInfo',
                type: 'richText',
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ]
                  },
                }),
                label: experienceLabels.practicalInfo,
                localized: true,
              },
              {
                name: 'infoCenter',
                type: 'richText',
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ]
                  },
                }),
                label: experienceLabels.infoCenter,
                localized: true,
              },
              {
                name: 'contactInfo',
                type: 'richText',
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ]
                  },
                }),
                label: experienceLabels.contactInfo,
                localized: true,
              },
            ],
          },
          // Tab 3: Location & Contact
          {
            label: tabLabels.location,
            fields: [
              {
                name: 'location',
                type: 'group',
                label: locationLabels.location,
                fields: [
                  {
                    name: 'address',
                    type: 'text',
                    label: locationLabels.address,
                    required: true,
                    localized: true,
                  },
                  {
                    name: 'coordinates',
                    type: 'group',
                    label: locationLabels.coordinates,
                    admin: {
                      description: commonDescriptions.coordinates,
                    },
                    fields: [
                      {
                        type: 'row',
                        fields: [
                          {
                            name: 'latitude',
                            type: 'number',
                            label: locationLabels.latitude,
                            required: true,
                            min: -90,
                            max: 90,
                          },
                          {
                            name: 'longitude',
                            type: 'number',
                            label: locationLabels.longitude,
                            required: true,
                            min: -180,
                            max: 180,
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
                ],
              },
              {
                name: 'contact',
                type: 'group',
                label: contactLabels.contact,
                fields: [
                  {
                    name: 'phone',
                    type: 'text',
                    label: contactLabels.phone,
                    admin: {
                      placeholder: '+1234567890',
                    },
                  },
                  {
                    name: 'email',
                    type: 'email',
                    label: contactLabels.email,
                  },
                  {
                    name: 'website',
                    type: 'text',
                    label: contactLabels.website,
                    admin: {
                      placeholder: 'https://example.com',
                    },
                  },
                ],
              },
            ],
          },
          // Tab 4: Type-specific Details
          {
            label: tabLabels.details,
            fields: [...typeSpecificFields],
          },
        ],
      },
    ],
    hooks: {
      // Revalidation hooks will be added per-collection in the individual files
      // Workflow hooks (syncPayloadStatus, beforeChange, afterChange, afterRead) are injected by the plugin
    },
    versions: {
      drafts: {
        autosave: false,
        schedulePublish: false,
        validate: false,
      },
      maxPerDoc: 50,
    },
  }
}
