import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { hiddenFromNonCurator } from '../../access/accessHelpers'
import {
  userCreateAccess,
  userReadAccess,
  userUpdateAccess,
  rolesFieldReadAccess,
  rolesFieldWriteAccess,
  assignedMunicipalitiesReadAccess,
  assignedMunicipalitiesWriteAccess,
} from '../../access/userAccess'
import { keycloakStrategy } from '../../auth/keycloak'
import { collectionLabels, userLabels, userDescriptions, userRoleOptions, adminGroupLabels } from '@/i18n/admin'
import { syncUserToKeycloak } from './hooks/syncKeycloak'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: collectionLabels.users,
  access: {
    admin: authenticated,
    create: userCreateAccess,
    delete: () => false,
    read: userReadAccess,
    update: userUpdateAccess,
  },
  admin: {
    group: adminGroupLabels.admin,
    hidden: hiddenFromNonCurator,
    defaultColumns: ['firstName', 'lastName', 'email', 'roles', 'lastLogin', 'isActive'],
    useAsTitle: '_title',
  },
  auth: {
    // Only allow Keycloak SSO login
    disableLocalStrategy: true,
    strategies: [
      keycloakStrategy,
    ],
  },
  hooks: {
    afterChange: [syncUserToKeycloak],
  },
  fields: [
    {
      name: '_title',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // Virtual field — prevent from being saved to DB
            delete siblingData._title
          },
        ],
        afterRead: [
          ({ data }) => {
            const parts = [data?.firstName, data?.lastName].filter(Boolean).join(' ')
            return parts ? `${parts} (${data?.email})` : data?.email || ''
          },
        ],
      },
    },
    {
      name: 'firstName',
      type: 'text',
      label: userLabels.firstName,
    },
    {
      name: 'lastName',
      type: 'text',
      label: userLabels.lastName,
    },
    {
      name: 'email',
      type: 'email',
      label: userLabels.email,
      required: true,
      unique: true,
      index: true,
      admin: {
        description: userDescriptions.email,
      },
    },
    {
      name: 'keycloakId',
      type: 'text',
      label: userLabels.keycloakId,
      unique: true,
      index: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'roles',
      type: 'select',
      label: userLabels.roles,
      hasMany: true,
      access: {
        read: rolesFieldReadAccess,
        create: rolesFieldWriteAccess,
        update: rolesFieldWriteAccess,
      },
      options: [
        { label: userRoleOptions[0].label, value: 'admin' },
        { label: userRoleOptions[1].label, value: 'business-owner' },
        { label: userRoleOptions[2].label, value: 'municipal-moderator' },
        { label: userRoleOptions[3].label, value: 'tourism-curator' },
      ],
      defaultValue: [],
      validate: (value) => {
        if (Array.isArray(value) && value.length > 1) {
          return 'Only one role can be assigned per user'
        }
        return true
      },
      admin: {
        description: userDescriptions.roles,
        components: {
          Field: '@/components/admin/SingleRoleSelect',
        },
      },
    },
    {
      name: 'assignedMunicipality',
      type: 'relationship',
      relationTo: 'municipalities',
      hasMany: false,
      access: {
        read: assignedMunicipalitiesReadAccess,
        create: assignedMunicipalitiesWriteAccess,
        update: assignedMunicipalitiesWriteAccess,
      },
      label: { en: 'Assigned Municipality', bg: 'Назначена община' },
      admin: {
        description: {
          en: 'Municipality that this user can moderate (only for municipal-moderator role)',
          bg: 'Община, която този потребител може да модерира (само за роля общински модератор)',
        },
        condition: (data) => {
          const roles = (data.roles as string[]) || []
          return roles.includes('municipal-moderator')
        },
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      label: userLabels.lastLogin,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
        position: 'sidebar',
        description: userDescriptions.lastLogin,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: userLabels.isActive,
      defaultValue: true,
      admin: {
        description: userDescriptions.isActive,
      },
    },
    {
      name: 'keycloakSyncStatus',
      type: 'select',
      label: userLabels.keycloakSyncStatus,
      options: [
        { label: 'Synced', value: 'synced' },
        { label: 'Pending', value: 'pending' },
        { label: 'Error', value: 'error' },
      ],
      admin: {
        hidden: true,
      },
    },
    {
      name: 'keycloakSyncedAt',
      type: 'date',
      label: userLabels.keycloakSyncedAt,
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
}
