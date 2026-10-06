import type { Field } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { eventLabels, eventDescriptions } from '@/i18n/admin'

export const eventFields: Field[] = [
  {
    name: 'subtitle',
    type: 'text',
    label: eventLabels.subtitle,
    localized: true,
    admin: {
      description: eventDescriptions.subtitle,
    },
  },
  {
    name: 'duration',
    type: 'text',
    label: eventLabels.duration,
    localized: true,
    admin: {
      description: eventDescriptions.duration,
    },
  },
  {
    name: 'period',
    type: 'group',
    label: eventLabels.period,
    fields: [
      {
        name: 'startDate',
        type: 'date',
        label: eventLabels.startDate,
        required: true,
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
          },
          description: eventDescriptions.startDate,
        },
      },
      {
        name: 'endDate',
        type: 'date',
        label: eventLabels.endDate,
        required: true,
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
          },
          description: eventDescriptions.endDate,
        },
      },
    ],
  },
  {
    name: 'allDay',
    type: 'checkbox',
    label: eventLabels.allDay,
    defaultValue: false,
    admin: {
      description: eventDescriptions.allDay,
    },
  },
  {
    name: 'ticketPriceLabel',
    type: 'text',
    label: eventLabels.ticketPriceLabel,
    localized: true,
    admin: {
      description: eventDescriptions.ticketPriceLabel,
    },
  },
  {
    name: 'organizer',
    type: 'text',
    label: eventLabels.organizer,
    admin: {
      description: eventDescriptions.organizer,
    },
  },
  {
    name: 'organizerDescription',
    type: 'richText',
    label: eventLabels.organizerDescription,
    localized: true,
    editor: lexicalEditor({
      features: ({ rootFeatures }) => [
        ...rootFeatures,
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
    admin: {
      description: eventDescriptions.organizerDescription,
    },
  },
  {
    name: 'organizerHighlights',
    type: 'relationship',
    relationTo: 'media',
    hasMany: true,
    label: eventLabels.organizerHighlights,
    admin: {
      description: eventDescriptions.organizerHighlights,
    },
  },
  {
    name: 'registrationUrl',
    type: 'text',
    label: eventLabels.registrationUrl,
    admin: {
      placeholder: 'https://example.com/register',
      description: eventDescriptions.registrationUrl,
    },
  },
]
