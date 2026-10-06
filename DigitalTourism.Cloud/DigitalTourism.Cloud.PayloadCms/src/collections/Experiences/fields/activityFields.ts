import type { Field } from 'payload'
import {
  activityLabels,
  activityDescriptions,
} from '@/i18n/admin'

export const activityFields: Field[] = [
  {
    name: 'duration',
    type: 'text',
    label: activityLabels.duration,
    required: true,
    admin: {
      placeholder: '2-3 hours',
      description: activityDescriptions.duration,
    },
  },
  {
    name: 'difficultyLevel',
    type: 'relationship',
    relationTo: 'difficulty-levels',
    label: activityLabels.difficultyLevel,
    required: true,
  },
  {
    name: 'seasonality',
    type: 'relationship',
    relationTo: 'seasons',
    label: activityLabels.seasonality,
    hasMany: true,
    admin: {
      description: activityDescriptions.seasonality,
    },
  },
  {
    name: 'minimumAge',
    type: 'number',
    label: activityLabels.minimumAge,
    min: 0,
    admin: {
      description: activityDescriptions.minimumAge,
    },
  },
  {
    name: 'groupSize',
    type: 'group',
    label: activityLabels.groupSize,
    fields: [
      {
        name: 'min',
        type: 'number',
        label: activityLabels.min,
        min: 1,
        admin: {
          description: activityDescriptions.groupSizeMin,
        },
      },
      {
        name: 'max',
        type: 'number',
        label: activityLabels.max,
        min: 1,
        admin: {
          description: activityDescriptions.groupSizeMax,
        },
      },
    ],
  },
  {
    name: 'equipmentProvided',
    type: 'checkbox',
    label: activityLabels.equipmentProvided,
    defaultValue: false,
    admin: {
      description: activityDescriptions.equipmentProvided,
    },
  },
  {
    name: 'whatToBring',
    type: 'textarea',
    label: activityLabels.whatToBring,
    localized: true,
    admin: {
      description: activityDescriptions.whatToBring,
    },
  },
  {
    name: 'includes',
    type: 'array',
    label: activityLabels.includes,
    fields: [
      {
        name: 'item',
        type: 'text',
        label: activityLabels.item,
        required: true,
        localized: true,
      },
    ],
    admin: {
      description: activityDescriptions.includes,
    },
  },
]
