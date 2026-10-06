import type { Field } from 'payload'
import { attractionLabels, attractionDescriptions } from '@/i18n/admin'

export const attractionFields: Field[] = [
  {
    name: 'visitDuration',
    type: 'number',
    label: attractionLabels.visitDuration,
    required: true,
    min: 0,
    admin: {
      description: attractionDescriptions.visitDuration,
    },
  },
  {
    name: 'attractionHours',
    type: 'text',
    label: attractionLabels.attractionHours,
    admin: {
      placeholder: 'Mon-Fri: 9:00-17:00, Sat-Sun: 10:00-18:00',
      description: attractionDescriptions.attractionHours,
    },
  },
]
