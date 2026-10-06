import type { Field } from 'payload'
import {
  hotelLabels,
  hotelDescriptions,
  starRatingOptions,
} from '@/i18n/admin'

export const hotelFields: Field[] = [
  {
    name: 'starRating',
    type: 'select',
    label: hotelLabels.starRating,
    required: true,
    options: starRatingOptions,
  },
  {
    name: 'rooms',
    type: 'number',
    label: hotelLabels.rooms,
    required: false,
    min: 1,
    admin: {
      description: hotelDescriptions.rooms,
    },
  },
  {
    name: 'amenities',
    type: 'relationship',
    relationTo: 'amenities',
    label: hotelLabels.amenities,
    hasMany: true,
  },
  {
    name: 'checkInTime',
    type: 'text',
    label: hotelLabels.checkInTime,
    admin: {
      placeholder: '15:00',
      description: hotelDescriptions.checkInTime,
    },
  },
  {
    name: 'checkOutTime',
    type: 'text',
    label: hotelLabels.checkOutTime,
    admin: {
      placeholder: '11:00',
      description: hotelDescriptions.checkOutTime,
    },
  },
  {
    name: 'bookingUrl',
    type: 'text',
    label: hotelLabels.bookingUrl,
    admin: {
      placeholder: 'https://booking.example.com',
      description: hotelDescriptions.bookingUrl,
    },
  },
]
