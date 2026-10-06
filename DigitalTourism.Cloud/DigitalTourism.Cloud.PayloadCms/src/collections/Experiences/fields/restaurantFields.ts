import type { Field } from 'payload'
import {
  restaurantLabels,
  restaurantDescriptions,
  dayOptions,
} from '@/i18n/admin'

export const restaurantFields: Field[] = [
  {
    name: 'cuisineType',
    type: 'relationship',
    relationTo: 'cuisine-types',
    label: restaurantLabels.cuisineType,
    hasMany: true,
    required: true,
  },
  {
    name: 'dietaryOptions',
    type: 'relationship',
    relationTo: 'dietary-options',
    label: restaurantLabels.dietaryOptions,
    hasMany: true,
  },
  {
    name: 'restaurantHours',
    type: 'array',
    label: restaurantLabels.restaurantHours,
    fields: [
      {
        name: 'days',
        type: 'select',
        label: restaurantLabels.days,
        hasMany: true,
        required: true,
        options: dayOptions,
      },
      {
        name: 'openTime',
        type: 'text',
        label: restaurantLabels.openTime,
        required: true,
        admin: {
          placeholder: '09:00',
        },
      },
      {
        name: 'closeTime',
        type: 'text',
        label: restaurantLabels.closeTime,
        required: true,
        admin: {
          placeholder: '22:00',
        },
      },
    ],
    admin: {
      description: restaurantDescriptions.restaurantHours,
    },
  },
  {
    name: 'menuUrl',
    type: 'text',
    label: restaurantLabels.menuUrl,
    admin: {
      placeholder: 'https://example.com/menu',
      description: restaurantDescriptions.menuUrl,
    },
  },
  {
    name: 'reservationUrl',
    type: 'text',
    label: restaurantLabels.reservationUrl,
    admin: {
      placeholder: 'https://example.com/reservations',
      description: restaurantDescriptions.reservationUrl,
    },
  },
]
