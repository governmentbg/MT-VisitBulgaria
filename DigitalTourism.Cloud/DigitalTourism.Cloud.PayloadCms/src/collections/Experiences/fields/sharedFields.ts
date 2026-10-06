import type { Field } from 'payload'

import { withMediaOwnerFilter } from '@/access/mediaAccess'

export const sharedFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
    localized: true,
  },
  {
    name: 'description',
    type: 'textarea',
    required: true,
    localized: true,
  },
  {
    name: 'location',
    type: 'group',
    fields: [
      {
        name: 'address',
        type: 'text',
        required: true,
        localized: true,
      },
      {
        name: 'city',
        type: 'text',
        required: true,
        localized: true,
      },
      {
        name: 'region',
        type: 'text',
        required: true,
        localized: true,
      },
      {
        name: 'coordinates',
        type: 'group',
        admin: {
          description: 'Geographic coordinates for the experience location',
        },
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'latitude',
                type: 'number',
                required: true,
                min: -90,
                max: 90,
              },
              {
                name: 'longitude',
                type: 'number',
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
    fields: [
      {
        name: 'phone',
        type: 'text',
        admin: {
          placeholder: '+1234567890',
        },
      },
      {
        name: 'email',
        type: 'email',
      },
      {
        name: 'website',
        type: 'text',
        admin: {
          placeholder: 'https://example.com',
        },
      },
    ],
  },
  {
    name: 'gallery',
    type: 'relationship',
    relationTo: 'media',
    hasMany: true,
    filterOptions: withMediaOwnerFilter({
      mimeType: { contains: 'image' },
    }),
    admin: {
      description: 'Image gallery for the experience',
      components: {
        Field: '@/components/admin/GalleryPicker',
      },
    },
  },
]
