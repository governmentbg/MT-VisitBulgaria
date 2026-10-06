import type { CollectionConfig } from 'payload'
import { anyAuthenticated } from '../access/authenticated'

export const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    hidden: true, // Hide from admin sidebar, as it's only relevant to visitors and admins will manage via relationships
  },
  defaultSort: '-createdAt',
  access: {
    create: anyAuthenticated,
    read: ({ req: { user } }) => {
      if (!user) return false
      // Admins can read all
      if (user.collection === 'users') return true
      // Visitors can only read their own
      if (user.collection === 'visitors') {
        return {
          visitor: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      if (user.collection === 'visitors') {
        return {
          visitor: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      if (user.collection === 'visitors') {
        return {
          visitor: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'visitor',
      type: 'relationship',
      relationTo: 'visitors',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            // Always set visitor from the logged-in user — client never needs to send it
            if (req.user?.collection === 'visitors') {
              return req.user.id
            }
          },
        ],
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true, // Initially might be null if just planning? Requirement says "Creates trip - selects date", implies required.
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Number of days',
      },
    },
    {
      name: 'days',
      type: 'array',
      label: 'Itinerary Days',
      fields: [
        {
          name: 'dayNumber',
          type: 'number',
          // required: true, // Implicit by array index, but good to have if we want to be explicit
          admin: {
            readOnly: true, // We'll manage this via hooks or just rely on array order
          },
        },
        {
          name: 'stops',
          type: 'array',
          fields: [
            {
              name: 'experience',
              type: 'relationship',
              relationTo: ['hotels', 'restaurants', 'activities', 'attractions', 'events'],
              required: true,
            },
            {
              name: 'note',
              type: 'textarea',
            },
            {
              name: 'visited',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'pool',
      type: 'array',
      label: 'Unassigned Experiences',
      admin: {
        description: 'Experiences in the sidebar that have not been assigned to a day yet',
      },
      fields: [
        {
          name: 'experience',
          type: 'relationship',
          relationTo: ['hotels', 'restaurants', 'activities', 'attractions', 'events'],
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}
