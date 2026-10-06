import type { CollectionConfig } from 'payload'
import { anyAuthenticated } from '../access/authenticated'

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  admin: {
    hidden: true
  },
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
    update: () => false, // Favorites are toggle-only (create/delete)
    delete: ({ req: { user } }) => {
      if (!user) return false
      // Admins can delete all
      if (user.collection === 'users') return true
      // Visitors can only delete their own
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
      name: 'visitor',
      type: 'relationship',
      relationTo: 'visitors',
      required: true,
      index: true,
      admin: {
        readOnly: true, // Set automatically on create usually, or passed in
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
      name: 'experience',
      type: 'relationship',
      relationTo: ['hotels', 'restaurants', 'activities', 'attractions', 'events'],
      required: true,
      index: true,
    },
  ],
  timestamps: true,
}
