import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { mediaFilterOptions, withMediaOwnerFilter } from '../../access/mediaAccess'
import {
  mediaBlockLabels as l,
  mediaBlockDescriptions as d,
  mediaTypeOptions,
  videoSourceTypeOptions,
  fontSizeOptions,
  fontFamilyOptions,
  fontWeightOptions,
  textColorOptions,
  textShadowOptions,
  captionVerticalPositionOptions,
  captionHorizontalAlignmentOptions,
  captionBackgroundOptions,
  captionContainerWidthOptions,
  captionAnimationOptions,
  mediaBlockLayoutOptions,
  mediaBlockBackgroundOptions,
  textAlignmentOptions,
  imageHeightOptions,
  blockGroupLabels,
} from '../../i18n/admin'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  imageURL: blockImageUrls.mediaBlock,
  imageAltText: 'Media block',
  admin: {
    group: blockGroupLabels.content,
  },
  fields: [
    // ── Media Type Selector ──
    {
      name: 'mediaType',
      type: 'select',
      label: l.mediaType,
      defaultValue: 'image',
      options: mediaTypeOptions,
      admin: { width: '50%' },
    },

    // ── Image fields (existing) ──
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      filterOptions: mediaFilterOptions,
      label: l.media,
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        const mt = siblingData?.mediaType
        if ((!mt || mt === 'image') && !value) return 'An image is required.'
        return true
      },
      admin: {
        condition: (_, siblingData) => !siblingData?.mediaType || siblingData.mediaType === 'image',
      },
    },

    // ── Video fields ──
    {
      name: 'videoSource',
      type: 'group',
      label: l.videoSource,
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
      fields: [
        {
          name: 'sourceType',
          type: 'select',
          label: l.sourceType,
          defaultValue: 'upload',
          options: videoSourceTypeOptions,
        },
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          label: l.videoFile,
          filterOptions: withMediaOwnerFilter({ mimeType: { contains: 'video' } }),
          admin: {
            condition: (_, siblingData) => siblingData?.sourceType === 'upload',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: l.videoUrl,
          admin: {
            description: d.videoUrl,
            condition: (_, siblingData) => siblingData?.sourceType === 'url',
          },
        },
        {
          name: 'embedUrl',
          type: 'text',
          label: l.embedUrl,
          admin: {
            description: d.embedUrl,
            condition: (_, siblingData) => siblingData?.sourceType === 'embed',
          },
        },
      ],
    },
    {
      name: 'captions',
      type: 'array',
      label: l.captions,
      labels: { singular: 'Caption', plural: 'Captions' },
      admin: {
        condition: (_, siblingData) =>
          siblingData?.mediaType === 'video' &&
          siblingData?.videoSource?.sourceType !== 'embed',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'startTime',
              type: 'number',
              label: l.startTime,
              required: true,
              min: 0,
              admin: { width: '15%', step: 0.1 },
            },
            {
              name: 'endTime',
              type: 'number',
              label: l.endTime,
              required: true,
              min: 0,
              admin: { width: '15%', step: 0.1 },
            },
            {
              name: 'text',
              type: 'text',
              localized: true,
              required: true,
              admin: { width: '70%' },
            },
          ],
        },
        {
          type: 'collapsible',
          label: l.style,
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fontSize',
                  type: 'select',
                  label: l.fontSize,
                  defaultValue: 'md',
                  options: fontSizeOptions,
                  admin: { width: '14%' },
                },
                {
                  name: 'fontFamily',
                  type: 'select',
                  label: l.fontFamily,
                  defaultValue: 'sans',
                  options: fontFamilyOptions,
                  admin: { width: '14%' },
                },
                {
                  name: 'fontWeight',
                  type: 'select',
                  label: l.fontWeight,
                  defaultValue: 'normal',
                  options: fontWeightOptions,
                  admin: { width: '14%' },
                },
                {
                  name: 'textColor',
                  type: 'select',
                  label: l.textColor,
                  defaultValue: 'white',
                  options: textColorOptions,
                  admin: { width: '14%' },
                },
                {
                  name: 'textShadow',
                  type: 'select',
                  label: l.textShadow,
                  defaultValue: 'none',
                  options: textShadowOptions,
                  admin: { width: '14%' },
                },
                {
                  name: 'animation',
                  type: 'select',
                  label: l.animation,
                  defaultValue: 'none',
                  options: captionAnimationOptions,
                  admin: { width: '14%' },
                },
                {
                  name: 'background',
                  type: 'select',
                  label: l.background,
                  defaultValue: 'dark',
                  options: captionBackgroundOptions,
                  admin: { width: '14%' },
                },
                {
                  name: 'containerWidth',
                  type: 'select',
                  label: l.captionWidth,
                  defaultValue: 'wide',
                  options: captionContainerWidthOptions,
                  admin: { width: '14%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'verticalPosition',
                  type: 'select',
                  label: l.verticalPosition,
                  defaultValue: 'bottom',
                  options: captionVerticalPositionOptions,
                  admin: { width: '20%' },
                },
                {
                  name: 'horizontalAlignment',
                  type: 'select',
                  label: l.horizontalAlignment,
                  defaultValue: 'center',
                  options: captionHorizontalAlignmentOptions,
                  admin: { width: '20%' },
                },
                {
                  name: 'x',
                  type: 'number',
                  label: l.manualX,
                  min: 0,
                  max: 100,
                  admin: {
                    width: '15%',
                    step: 1,
                    description: d.manualXY,
                  },
                },
                {
                  name: 'y',
                  type: 'number',
                  label: l.manualY,
                  min: 0,
                  max: 100,
                  admin: {
                    width: '15%',
                    step: 1,
                    description: d.manualXY,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'videoOptions',
      type: 'group',
      label: l.videoOptions,
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'autoPlay',
              type: 'checkbox',
              label: l.autoPlay,
              defaultValue: false,
              admin: { width: '33%' },
            },
            {
              name: 'loop',
              type: 'checkbox',
              label: l.loop,
              defaultValue: false,
              admin: { width: '33%' },
            },
            {
              name: 'showControls',
              type: 'checkbox',
              label: l.showControls,
              defaultValue: true,
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },

    // ── Heading & Description (shown above the media) ──
    {
      name: 'heading',
      type: 'text',
      localized: true,
      label: l.heading,
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
      label: l.description,
    },

    // ── Shared fields ──
    {
      name: 'altText',
      type: 'text',
      localized: true,
      label: l.altText,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          label: l.layout,
          defaultValue: 'default',
          options: mediaBlockLayoutOptions,
          admin: { width: '25%' },
        },
        {
          name: 'background',
          type: 'select',
          label: l.blockBackground,
          defaultValue: 'none',
          options: mediaBlockBackgroundOptions,
          admin: { width: '25%' },
        },
        {
          name: 'textAlignment',
          type: 'select',
          label: l.textAlignment,
          defaultValue: 'center',
          options: textAlignmentOptions,
          admin: { width: '25%' },
        },
        {
          name: 'imageHeight',
          type: 'select',
          label: l.imageHeight,
          defaultValue: 'auto',
          options: imageHeightOptions,
          admin: {
            width: '25%',
            condition: (_, siblingData) => !siblingData?.mediaType || siblingData.mediaType === 'image',
          },
        },
      ],
    },
    {
      name: 'enableParallax',
      type: 'checkbox',
      label: l.enableParallax,
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => !siblingData?.mediaType || siblingData.mediaType === 'image',
      },
    },
    {
      name: 'blockCaption',
      type: 'richText',
      localized: true,
      label: l.caption,
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
}
