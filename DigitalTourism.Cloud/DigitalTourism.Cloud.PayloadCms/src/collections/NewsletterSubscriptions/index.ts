import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { curatorOrAdmin, hiddenFromNonCurator } from '../../access/accessHelpers'
import { collectionLabels, adminGroupLabels } from '@/i18n/admin'
import { LOCALE_CODES } from '@/i18n/localization'

const newsletterLabels = {
  email: { en: 'Email', bg: 'Имейл' },
  status: { en: 'Status', bg: 'Статус' },
  locale: { en: 'Locale', bg: 'Език' },
  source: { en: 'Source', bg: 'Източник' },
}

const statusOptions = [
  { label: { en: 'Active', bg: 'Активен' }, value: 'active' },
  { label: { en: 'Unsubscribed', bg: 'Отписан' }, value: 'unsubscribed' },
]

const localeOptions = LOCALE_CODES.map((code) => ({
  label: code.toUpperCase(),
  value: code,
}))

export const NewsletterSubscriptions: CollectionConfig = {
  slug: 'newsletter-subscriptions',
  labels: collectionLabels.newsletterSubscriptions,
  access: {
    create: anyone,
    delete: curatorOrAdmin,
    read: curatorOrAdmin,
    update: curatorOrAdmin,
  },
  admin: {
    group: adminGroupLabels.settings,
    hidden: hiddenFromNonCurator,
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'locale', 'source', 'createdAt'],
    components: {
      beforeListTable: [
        '@/collections/NewsletterSubscriptions/ExportButtons#ExportButtons',
      ],
    },
  },
  timestamps: true,
  fields: [
    {
      name: 'email',
      type: 'email',
      label: newsletterLabels.email,
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      label: newsletterLabels.status,
      options: statusOptions,
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'locale',
      type: 'select',
      label: newsletterLabels.locale,
      options: localeOptions,
      defaultValue: 'en',
    },
    {
      name: 'source',
      type: 'text',
      label: newsletterLabels.source,
      defaultValue: 'footer',
    },
  ],
}
