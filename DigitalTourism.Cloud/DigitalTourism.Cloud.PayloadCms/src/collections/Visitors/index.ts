import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { hiddenFromNonAdmin } from '../../access/accessHelpers'
import { visitorKeycloakStrategy } from '../../auth/keycloak'
import {
  collectionLabels,
  visitorLabels,
  visitorDescriptions,
  visitorAdminDescriptions,
  visitorLanguageOptions,
  adminGroupLabels,
} from '@/i18n/admin'

export const Visitors: CollectionConfig = {
  slug: 'visitors',
  labels: collectionLabels.visitors,
  auth: {
    disableLocalStrategy: true,
    strategies: [visitorKeycloakStrategy],
  },
  access: {
    // Only CMS admin users can access visitors in admin panel
    admin: authenticated,
    // Only via OAuth callback - not directly creatable
    create: () => false,
    // Visitors cannot be deleted from admin panel
    delete: () => false,
    // Admins can read all, visitors can read their own data
    read: ({ req }) => {
      // CMS admin users can read all visitors
      if (req.user?.collection === 'users') return true
      // Visitors can only read their own data
      if (req.user?.collection === 'visitors') {
        return { id: { equals: req.user.id } }
      }
      return false
    },
    // Visitors can update their own preferences
    update: ({ req }) => {
      if (req.user?.collection === 'visitors') {
        return { id: { equals: req.user.id } }
      }
      return false
    },
  },
  admin: {
    hidden: hiddenFromNonAdmin,
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'language', 'createdAt'],
    description: visitorAdminDescriptions.collection,
    group: adminGroupLabels.admin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: visitorLabels.name,
      admin: {
        description: visitorDescriptions.name,
        readOnly: true,
      },
    },
    {
      name: 'email',
      type: 'email',
      label: visitorLabels.email,
      required: true,
      unique: true,
      index: true,
      admin: {
        description: visitorDescriptions.email,
        readOnly: true,
      },
    },
    {
      name: 'keycloakId',
      type: 'text',
      label: visitorLabels.keycloakId,
      required: true,
      unique: true,
      index: true,
      admin: {
        description: visitorDescriptions.keycloakId,
        readOnly: true,
      },
    },
    {
      name: 'language',
      type: 'select',
      label: visitorLabels.language,
      options: visitorLanguageOptions,
      defaultValue: 'en',
      admin: {
        description: visitorDescriptions.language,
      },
    },
    {
      name: 'preferences',
      type: 'group',
      label: visitorLabels.preferences,
      admin: {
        description: visitorDescriptions.preferences,
      },
      fields: [
        {
          name: 'notifications',
          type: 'group',
          label: visitorLabels.notifications,
          fields: [
            {
              name: 'email',
              type: 'checkbox',
              defaultValue: true,
              label: visitorLabels.emailNotifications,
            },
            {
              name: 'push',
              type: 'checkbox',
              defaultValue: true,
              label: visitorLabels.pushNotifications,
            },
          ],
        },
        {
          name: 'interests',
          type: 'relationship',
          label: visitorLabels.interests,
          relationTo: 'categories',
          hasMany: true,
          admin: {
            description: visitorDescriptions.interests,
          },
        },
      ],
    },
  ],
  timestamps: true,
}
