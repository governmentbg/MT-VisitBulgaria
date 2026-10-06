import type { CollectionConfig, ImageUploadFormatOptions } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { authenticated } from '../access/authenticated'
import { mediaReadAccess, mediaUpdateAccess, mediaDeleteAccess, mediaBaseListFilter } from '../access/mediaAccess'
import { collectionLabels, mediaLabels, adminGroupLabels } from '@/i18n/admin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const avifFormatOptions: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 75,
  },
}

const ogFormatOptions: ImageUploadFormatOptions = {
  format: 'webp',
  options: {
    quality: 75,
  },
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: collectionLabels.media,
  folders: false,
  admin: {
    group: adminGroupLabels.content,
    baseListFilter: mediaBaseListFilter,
  },
  access: {
    create: authenticated,
    delete: mediaDeleteAccess,
    read: mediaReadAccess,
    update: mediaUpdateAccess,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: mediaLabels.alt,
      localized: true,
    },
    {
      name: 'caption',
      type: 'richText',
      label: mediaLabels.caption,
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: true,
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req, value }) => {
            if (!value && req.user?.collection === 'users') {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'video/mp4',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
    ],
    focalPoint: true,
    // Convert all images to AVIF (OG stays WebP for social media compatibility)
    formatOptions: avifFormatOptions,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 420,
        formatOptions: avifFormatOptions,
        withoutEnlargement: false,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: avifFormatOptions,
        withoutEnlargement: false,
      },
      {
        name: 'small',
        width: 600,
        formatOptions: avifFormatOptions,
        withoutEnlargement: false,
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: avifFormatOptions,
        withoutEnlargement: false,
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: avifFormatOptions,
        withoutEnlargement: false,
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: avifFormatOptions,
        withoutEnlargement: false,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: ogFormatOptions,
        withoutEnlargement: false,
      },
    ],
  },
}
