import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'
import { link } from '@/fields/link'

export const SvgMapBlock: Block = {
  slug: 'svgMap',
  interfaceName: 'SvgMapBlock',
  labels: {
    singular: 'SVG Map',
    plural: 'SVG Maps',
  },
  imageURL: blockImageUrls.svgMap,
  imageAltText: 'SVG map',
  admin: {
    group: blockGroupLabels.mapsLocation,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'svgFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Upload an SVG map file. Each clickable region must have a unique id attribute (e.g. id="region-sofia").',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional decorative background image (faded map overlay).',
      },
    },
    {
      name: 'regions',
      type: 'array',
      minRows: 1,
      admin: {
        initCollapsed: true,
        description:
          'Define clickable regions. Each regionId must match an id attribute in the uploaded SVG.',
      },
      fields: [
        {
          name: 'regionId',
          type: 'text',
          required: true,
          admin: {
            description: 'Must match the id attribute of the SVG path (e.g. "region-sofia").',
          },
        },
        {
          name: 'name',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        link({ appearances: false }),
        {
          name: 'gallery',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          maxRows: 4,
          admin: {
            description: 'Gallery images for this region (max 4).',
          },
        },
      ],
    },
    {
      name: 'defaultRegionIndex',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Which region to show by default (0-based index).',
      },
    },
  ],
}
